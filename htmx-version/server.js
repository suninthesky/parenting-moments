const express = require('express');
const path = require('path');
const { scenarios, developmentalStages, parentingStrategies } = require('./scenarios');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// Game state (in memory for Phase 1-2)
let gameState = {
    currentScenarioIndex: 0,
    score: 0,
    mood: 100,
    patience: 100
};

// Helper function to update meters based on choice
function updateMeters(choice) {
    const impacts = {
        positive: { mood: 10, patience: 5, score: 100 },
        neutral: { mood: 0, patience: -5, score: 50 },
        negative: { mood: -15, patience: -10, score: 0 }
    };

    const oldScore = gameState.score;
    const impact = impacts[choice.impact || 'neutral'];
    
    gameState.mood = Math.max(0, Math.min(100, gameState.mood + impact.mood));
    gameState.patience = Math.max(0, Math.min(100, gameState.patience + impact.patience));
    gameState.score += impact.score;

    return {
        mood: gameState.mood,
        patience: gameState.patience,
        score: gameState.score,
        oldScore: oldScore
    };
}

// Route to serve the main page
app.get('/', (req, res) => {
    // Reset game state when serving the main page
    gameState.currentScenarioIndex = 0;
    gameState.mood = 100;
    gameState.patience = 100;
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add route to get initial scenario
app.get('/initial-scenario', (req, res) => {
    const scenario = scenarios[gameState.currentScenarioIndex];
    const stage = developmentalStages[scenario.developmentStage];
    
    res.send(`
        <div class="relative h-1.5 w-full rounded-t-lg overflow-hidden">
            <div id="timer-bar" class="h-full bg-green-500 transition-all duration-1000" style="width: 100%"></div>
            <div id="timeout-notice" class="absolute inset-0 flex items-center justify-center text-xs text-white font-medium opacity-0 transition-opacity duration-300">
                Child's patience lowering...
            </div>
        </div>
        
        <div class="p-4 sm:p-6">
            <h3 class="text-xl sm:text-2xl font-semibold mb-4">${scenario.situation}</h3>
            
            <div class="space-y-3">
                ${scenario.options.map(option => `
                    <button 
                        hx-post="/make-choice" 
                        hx-target="#scenario"
                        hx-vals='{"value": "${option.id}"}'
                        class="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform transition-all duration-200 hover:scale-102 hover:shadow-lg active:scale-98 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        ${option.text}
                    </button>
                `).join('')}
            </div>

            <div id="parenting-tip" class="transform transition-all duration-500 opacity-0 h-0 overflow-hidden">
                <div class="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400 mt-6">
                    <h4 class="font-semibold text-yellow-800 mb-2">Parenting Tip:</h4>
                    <p class="text-yellow-700 text-sm sm:text-base">${scenario.tip}</p>
                </div>
            </div>
        </div>

        <!-- Update development info -->
        <div id="age-stage" hx-swap-oob="true">
            ${stage.ageRange} years
        </div>
        <div id="development-info" hx-swap-oob="true">
            ${scenario.developmentContext}
        </div>
    `);
});

// Route to handle choice submission
app.post('/make-choice', (req, res) => {
    const scenario = scenarios[gameState.currentScenarioIndex];
    const choiceId = parseInt(req.body.value);
    const choice = scenario.options.find(opt => opt.id === choiceId);
    
    const meters = updateMeters(choice);
    
    // Get the strategy information
    const strategy = parentingStrategies[choice.strategy];
    
    res.send(`
        <div class="p-4 sm:p-6">
            <h3 class="text-2xl font-semibold mb-6">Outcome Analysis</h3>
            
            <div class="space-y-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">Social & Emotional Impact</h4>
                    <p class="text-blue-600 text-sm sm:text-base">${choice.socialEmotionalLearning}</p>
                </div>
                
                <div class="bg-yellow-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-yellow-800 mb-2">Parenting Strategy Used</h4>
                    <p class="text-yellow-700 text-sm sm:text-base">${strategy.description}</p>
                    <p class="text-yellow-600 text-sm mt-2"><strong>Research shows:</strong> ${strategy.evidence}</p>
                </div>
            </div>

            <button 
                hx-get="/next-scenario"
                hx-target="#scenario"
                class="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md transform transition-all duration-200 hover:scale-102 hover:shadow-lg active:scale-98 text-center">
                Continue to Next Situation
            </button>
        </div>

        <!-- Update meters using HTMX's out-of-band swaps -->
        <div id="mood-meter" hx-swap-oob="true" 
             class="h-full transition-all duration-500 ease-out"
             style="width: ${meters.mood}%; background: linear-gradient(90deg, #22c55e, #16a34a)">
        </div>
        <div id="patience-meter" hx-swap-oob="true"
             class="h-full transition-all duration-500 ease-out"
             style="width: ${meters.patience}%; background: linear-gradient(90deg, #3b82f6, #2563eb)">
        </div>
        
        <script hx-swap-oob="true">
            updateEmoji(${meters.mood}, 'mood');
            updateEmoji(${meters.patience}, 'patience');
            document.getElementById('${choice.impact === 'positive' ? 'successSound' : 'warningSound'}').play();
        </script>
    `);
});

// Route to get next scenario
app.get('/next-scenario', (req, res) => {
    gameState.currentScenarioIndex = (gameState.currentScenarioIndex + 1) % scenarios.length;
    const scenario = scenarios[gameState.currentScenarioIndex];
    
    res.send(`
        <div class="relative h-4 w-full rounded-t-lg overflow-hidden">
            <div id="timer-bar" class="h-full bg-green-500 transition-all duration-1000" style="width: 100%"></div>
            <div id="timeout-notice" class="absolute inset-0 flex items-center justify-center text-xs text-white font-medium opacity-0 transition-opacity duration-300">
                Child's patience lowering...
            </div>
        </div>
        
        <div class="p-6">
            <h3 class="text-2xl font-semibold mb-4">${scenario.situation}</h3>
            
            <div class="space-y-3">
                ${scenario.options.map(option => `
                    <button 
                        hx-post="/make-choice" 
                        hx-target="#scenario"
                        hx-vals='{"value": "${option.id}"}'
                        class="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform transition-all duration-200 hover:scale-102 hover:shadow-lg active:scale-98 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        ${option.text}
                    </button>
                `).join('')}
            </div>

            <div id="parenting-tip" class="transform transition-all duration-500 opacity-0 h-0 overflow-hidden">
                <div class="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400 mt-6">
                    <h4 class="font-semibold text-yellow-800 mb-2">Parenting Tip:</h4>
                    <p class="text-yellow-700">${scenario.tip}</p>
                </div>
            </div>
        </div>
    `);
});

app.listen(port, () => {
    console.log(`Parenting Moments game running at http://localhost:${port}`);
}); 
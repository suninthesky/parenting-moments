const express = require('express');
const path = require('path');
const scenarios = require('./scenarios');

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
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle choice submission
app.post('/make-choice', (req, res) => {
    const scenario = scenarios[gameState.currentScenarioIndex];
    const choiceId = parseInt(req.body.value);
    const choice = scenario.options.find(opt => opt.id === choiceId);
    
    const meters = updateMeters(choice);
    
    // Send outcome view first
    res.send(`
        <div class="p-6 outcome-view">
            <h3 class="text-2xl font-semibold mb-6">Outcome Analysis</h3>
            
            <div class="grid gap-6 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">Social Impact</h4>
                    <p class="text-blue-600">${choice.socialImpact || 'This choice affects how your child learns to interact and communicate with others.'}</p>
                </div>
                
                <div class="bg-purple-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-purple-800 mb-2">Emotional Impact</h4>
                    <p class="text-purple-600">${choice.emotionalImpact || 'This choice influences your child\'s emotional development and self-regulation skills.'}</p>
                </div>
                
                <div class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2">Learning Impact</h4>
                    <p class="text-green-600">${choice.learningImpact || 'This choice shapes how your child approaches problem-solving and learning from experiences.'}</p>
                </div>
            </div>

            <button 
                hx-get="/next-scenario"
                hx-target="#scenario"
                class="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md transform transition-all duration-200 hover:scale-102 hover:shadow-lg active:scale-98 text-center">
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
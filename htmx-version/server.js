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

    const impact = impacts[choice.impact || 'neutral'];
    
    gameState.mood = Math.max(0, Math.min(100, gameState.mood + impact.mood));
    gameState.patience = Math.max(0, Math.min(100, gameState.patience + impact.patience));
    gameState.score += impact.score;

    return {
        mood: gameState.mood,
        patience: gameState.patience,
        score: gameState.score
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
    
    // Set content type for HTMX response
    res.setHeader('Content-Type', 'text/html');
    
    res.send(`
        <div class="bg-white p-6 rounded-lg shadow-md">
            <p class="text-lg mb-4">${choice.outcome}</p>
            <div class="bg-blue-50 p-4 rounded-lg mb-4">
                <strong class="block text-blue-800 mb-2">Learning Point:</strong>
                <p class="text-blue-600">${choice.educationalNote}</p>
            </div>
            <button 
                hx-get="/next-scenario"
                hx-target="#scenario"
                class="btn-primary mt-4">
                Next Situation
            </button>
        </div>

        <!-- Update meters using HTMX's out-of-band swaps -->
        <div id="score" hx-swap-oob="true">${meters.score}</div>
        <div id="mood-meter" hx-swap-oob="true" class="h-full bg-green-500 transition-all duration-500" style="width: ${meters.mood}%"></div>
        <div id="patience-meter" hx-swap-oob="true" class="h-full bg-blue-500 transition-all duration-500" style="width: ${meters.patience}%"></div>
    `);
});

// Route to handle timeout
app.post('/timeout', (req, res) => {
    const meters = updateMeters({ impact: 'negative' });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <div class="bg-red-50 p-6 rounded-lg shadow-md">
            <p class="text-lg mb-4 text-red-700">Time's up! Quick responses are important in parenting.</p>
            <button 
                hx-get="/next-scenario"
                hx-target="#scenario"
                class="btn-primary mt-4">
                Try Next Situation
            </button>
        </div>

        <!-- Update meters using HTMX's out-of-band swaps -->
        <div id="score" hx-swap-oob="true">${meters.score}</div>
        <div id="mood-meter" hx-swap-oob="true" class="h-full bg-green-500 transition-all duration-500" style="width: ${meters.mood}%"></div>
        <div id="patience-meter" hx-swap-oob="true" class="h-full bg-blue-500 transition-all duration-500" style="width: ${meters.patience}%"></div>
    `);
});

// Route to get next scenario
app.get('/next-scenario', (req, res) => {
    gameState.currentScenarioIndex = (gameState.currentScenarioIndex + 1) % scenarios.length;
    const scenario = scenarios[gameState.currentScenarioIndex];
    
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-semibold">Current Situation</h3>
            <div id="timer" class="text-2xl font-bold text-red-500 animate-pulse-slow">10</div>
        </div>
        <p class="text-lg bg-blue-50 p-4 rounded-lg mb-6">${scenario.situation}</p>
        <div class="space-y-3">
            ${scenario.options.map(option => `
                <button 
                    hx-post="/make-choice" 
                    hx-target="#outcome"
                    hx-vals='{"value": ${option.id}}'
                    class="btn-primary w-full text-left">
                    ${option.text}
                </button>
            `).join('')}
        </div>
    `);
});

app.listen(port, () => {
    console.log(`Parenting Moments game running at http://localhost:${port}`);
}); 
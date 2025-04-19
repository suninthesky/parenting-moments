const express = require('express');
const path = require('path');
const scenarios = require('./scenarios');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Current scenario tracking (in memory for Phase 1)
let currentScenarioIndex = 0;

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle choice submission
app.post('/make-choice', (req, res) => {
    const scenario = scenarios[currentScenarioIndex];
    const choiceId = parseInt(req.body.value);
    const choice = scenario.options.find(opt => opt.id === choiceId);
    
    // Send back the outcome HTML
    res.send(`
        <div class="outcome-result">
            <p>${choice.outcome}</p>
            <div class="educational-note">
                <strong>Learning Point:</strong>
                <p>${choice.educationalNote}</p>
            </div>
            <button 
                hx-get="/next-scenario"
                hx-target="#scenario"
                class="next-button">
                Next Situation
            </button>
        </div>
    `);
});

// Route to get next scenario
app.get('/next-scenario', (req, res) => {
    currentScenarioIndex = (currentScenarioIndex + 1) % scenarios.length;
    const scenario = scenarios[currentScenarioIndex];
    
    res.send(`
        <h3 class="text-2xl font-semibold mb-4">Current Situation</h3>
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
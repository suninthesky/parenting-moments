const express = require('express');
const path = require('path');
const { scenarios, parentingStrategies } = require('./scenarios');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Helper: status bars HTML
function statusBarsHTML() {
  return `
    <div class="flex flex-row gap-2 mb-4">
      <div class="flex-1">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-gray-600">Child's Mood</span>
          <span id="mood-emoji" class="text-lg">😊</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div id="mood-meter" class="h-full bg-green-500 transition-all duration-500" style="width: 100%"></div>
        </div>
      </div>
      <div class="flex-1">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-gray-600">Parent's Patience</span>
          <span id="patience-emoji" class="text-lg">🧘</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div id="patience-meter" class="h-full bg-blue-500 transition-all duration-500" style="width: 100%"></div>
        </div>
      </div>
    </div>
  `;
}

// Helper: timer bar HTML
function timerBarHTML() {
  return `
    <div class="relative h-2 w-full rounded-t-lg overflow-hidden mb-2">
      <div id="timer-bar" class="h-full bg-green-500 transition-all duration-1000" style="width: 100%"></div>
      <div id="timeout-notice" class="absolute inset-0 flex items-center justify-center text-xs text-white font-medium opacity-0 transition-opacity duration-300">
        Child's patience lowering...
      </div>
    </div>
  `;
}

// Serve a scenario by index
app.get('/scenario/:index', (req, res) => {
  const idx = parseInt(req.params.index, 10);
  if (isNaN(idx) || idx < 0 || idx >= scenarios.length) {
    return res.redirect('/result');
  }
  const scenario = scenarios[idx];
  res.send(`
    <body class="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex flex-col">
      <main class="flex-1 flex flex-col justify-center items-center px-2">
        <div class="w-full max-w-md mx-auto bg-white/90 rounded-lg shadow-lg mt-4 mb-4">
          <div class="p-4">
            <h2 class="text-xl font-bold text-blue-700 mb-2">Scenario ${idx + 1} of ${scenarios.length}</h2>
            ${statusBarsHTML()}
            ${timerBarHTML()}
            <p class="text-lg text-gray-800 mb-6">${scenario.situation}</p>
            <div class="space-y-3">
              ${scenario.options.map(option => `
                <button
                  hx-post="/choose"
                  hx-vals='{"scenario":${idx},"choice":${option.id}}'
                  hx-target="body"
                  hx-swap="outerHTML"
                  class="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-98"
                >${option.text}</button>
              `).join('')}
            </div>
            <div class="mt-6 bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
              <h4 class="font-semibold text-yellow-800 mb-2">Parenting Tip:</h4>
              <p class="text-yellow-700 text-sm">${scenario.tip}</p>
            </div>
          </div>
        </div>
      </main>
      <script src="/public/js/app.js"></script>
    </body>
  `);
});

// Handle a choice and show outcome, then next scenario or result
app.post('/choose', express.urlencoded({ extended: true }), (req, res) => {
  const scenarioIdx = parseInt(req.body.scenario, 10);
  const choiceId = parseInt(req.body.choice, 10);
  const scenario = scenarios[scenarioIdx];
  const choice = scenario.options.find(opt => opt.id === choiceId);
  const strategy = parentingStrategies[choice.strategy];

  res.send(`
    <body class="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex flex-col">
      <main class="flex-1 flex flex-col justify-center items-center px-2">
        <div class="w-full max-w-md mx-auto bg-white/90 rounded-lg shadow-lg mt-4 mb-4">
          <div class="p-4">
            <h2 class="text-xl font-bold text-blue-700 mb-2">Outcome</h2>
            ${statusBarsHTML()}
            <p class="text-lg text-gray-800 mb-4">${choice.outcome}</p>
            <div class="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 class="font-semibold text-blue-800 mb-2">Social & Emotional Learning</h4>
              <p class="text-blue-600 text-sm">${choice.socialEmotionalLearning}</p>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg mb-4">
              <h4 class="font-semibold text-yellow-800 mb-2">Parenting Strategy Used</h4>
              <p class="text-yellow-700 text-sm">${strategy.description}</p>
              <p class="text-yellow-600 text-xs mt-2"><strong>Research shows:</strong> ${strategy.evidence}</p>
            </div>
            <button
              id="next-btn"
              class="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-98"
              hx-get="${scenarioIdx + 1 < scenarios.length ? `/scenario/${scenarioIdx + 1}` : '/result'}"
              hx-target="body"
              hx-swap="outerHTML"
              onclick="(function(){
                let progress = window.parentingApp.loadProgress();
                progress.choices[${scenarioIdx}] = { scenario: ${scenarioIdx}, choice: ${choiceId} };
                progress.current = ${scenarioIdx + 1};
                // Example: update mood/patience based on impact
                if ('${choice.impact}' === 'positive') {
                  progress.mood = Math.min(100, (progress.mood || 100) + 10);
                  progress.patience = Math.min(100, (progress.patience || 100) + 5);
                } else if ('${choice.impact}' === 'negative') {
                  progress.mood = Math.max(0, (progress.mood || 100) - 15);
                  progress.patience = Math.max(0, (progress.patience || 100) - 10);
                }
                window.parentingApp.saveProgress(progress);
              })()"
            >
              ${scenarioIdx + 1 < scenarios.length ? 'Next Scenario' : 'See My Results'}
            </button>
          </div>
        </div>
      </main>
      <script src="/public/js/app.js"></script>
    </body>
  `);
});

// Results page
app.get('/result', (req, res) => {
  // The client will have saved progress in localStorage
  // We'll use a script to read and render the summary
  res.send(`
    <body class="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex flex-col">
      <main class="flex-1 flex flex-col justify-center items-center px-2">
        <div class="w-full max-w-md mx-auto bg-white/90 rounded-lg shadow-lg mt-4 mb-4">
          <div class="p-4">
            <h2 class="text-2xl font-bold text-blue-700 mb-4">Your Parenting Journey</h2>
            <div id="summary"></div>
            <button
              class="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-98"
              onclick="window.parentingApp.clearProgress(); window.location.href='/'"
            >Restart</button>
          </div>
        </div>
      </main>
      <script>
        const scenarios = ${JSON.stringify(scenarios)};
        const strategies = ${JSON.stringify(parentingStrategies)};
        const progress = window.parentingApp.loadProgress();
        let html = '';
        let strategyCount = {};
        if (progress.choices && progress.choices.length) {
          html += '<ol class="mb-4">';
          progress.choices.forEach((entry, idx) => {
            const sc = scenarios[entry.scenario];
            const ch = sc.options.find(o => o.id === entry.choice);
            html += '<li class="mb-3">';
            html += '<div class="font-semibold text-blue-800 mb-1">Scenario ' + (idx + 1) + ':</div>';
            html += '<div class="text-gray-800 mb-1">' + sc.situation + '</div>';
            html += '<div class="text-green-700 mb-1">Your choice: ' + ch.text + '</div>';
            html += '<div class="text-blue-600 text-sm mb-1">' + ch.socialEmotionalLearning + '</div>';
            html += '<div class="text-yellow-700 text-xs mb-1">Strategy: ' + strategies[ch.strategy].description + '</div>';
            html += '</li>';
            strategyCount[ch.strategy] = (strategyCount[ch.strategy] || 0) + 1;
          });
          html += '</ol>';
          // Actionable guidance
          html += '<div class="mt-4">';
          html += '<h3 class="font-semibold text-lg text-blue-700 mb-2">Actionable Guidance</h3>';
          html += '<ul class="list-disc pl-5 text-sm text-gray-700">';
          Object.keys(strategyCount).forEach(strat => {
            html += '<li><span class="font-semibold">' + strategies[strat].description + ':</span> ' + strategies[strat].evidence + '</li>';
          });
          html += '</ul></div>';
        } else {
          html = '<p class="text-gray-700">No choices recorded. Please start the journey!</p>';
        }
        document.getElementById('summary').innerHTML = html;
      </script>
      <script src="/public/js/app.js"></script>
    </body>
  `);
});

app.listen(port, () => {
  console.log(`Parenting Moments running at http://localhost:${port}`);
}); 
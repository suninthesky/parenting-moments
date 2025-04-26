// --- State Management ---
const STORAGE_KEY = 'parenting-moments-progress';

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function loadProgress() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { current: 0, choices: [], mood: 100, patience: 100 };
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

// --- Timer and Status Bar Logic ---
let timerInterval = null;
let patienceInterval = null;
let timerDuration = 10; // seconds
let timerLeft = timerDuration;
let timerActive = false;

function startScenarioTimer(duration = 10) {
  stopScenarioTimer();
  timerDuration = duration;
  timerLeft = duration;
  timerActive = true;
  updateTimerBar();

  timerInterval = setInterval(() => {
    timerLeft--;
    updateTimerBar();
    if (timerLeft <= 0) {
      timerActive = false;
      clearInterval(timerInterval);
      showTimeoutNotice();
      startLoweringPatience();
    }
  }, 1000);
}

function stopScenarioTimer() {
  timerActive = false;
  if (timerInterval) clearInterval(timerInterval);
  if (patienceInterval) clearInterval(patienceInterval);
}

function updateTimerBar() {
  const bar = document.getElementById('timer-bar');
  if (!bar) return;
  const percent = Math.max(0, (timerLeft / timerDuration) * 100);
  bar.style.width = percent + '%';
  if (percent > 60) {
    bar.className = 'h-full bg-green-500 transition-all duration-500';
  } else if (percent > 30) {
    bar.className = 'h-full bg-yellow-500 transition-all duration-500';
  } else {
    bar.className = 'h-full bg-red-500 transition-all duration-500';
  }
  // Hide timeout notice if timer is running
  const notice = document.getElementById('timeout-notice');
  if (notice) notice.classList.add('opacity-0');
}

function showTimeoutNotice() {
  const notice = document.getElementById('timeout-notice');
  if (notice) notice.classList.remove('opacity-0');
}

function startLoweringPatience() {
  if (patienceInterval) clearInterval(patienceInterval);
  patienceInterval = setInterval(() => {
    let progress = loadProgress();
    if (progress.patience > 0) {
      progress.patience = Math.max(0, progress.patience - 2);
      saveProgress(progress);
      updateStatusBars();
    }
  }, 1000);
}

// --- Status Bar Logic ---
function getStatus(key) {
  const progress = loadProgress();
  return progress[key] !== undefined ? progress[key] : 100;
}

function setStatus(key, value) {
  const progress = loadProgress();
  progress[key] = value;
  saveProgress(progress);
}

function updateStatusBars() {
  const mood = getStatus('mood');
  const patience = getStatus('patience');
  const moodBar = document.getElementById('mood-meter');
  const patienceBar = document.getElementById('patience-meter');
  if (moodBar) {
    moodBar.style.width = mood + '%';
    moodBar.className = 'h-full transition-all duration-500 ' +
      (mood > 60 ? 'bg-green-500' : mood > 30 ? 'bg-yellow-500' : 'bg-red-500');
  }
  if (patienceBar) {
    patienceBar.style.width = patience + '%';
    patienceBar.className = 'h-full transition-all duration-500 ' +
      (patience > 60 ? 'bg-blue-500' : patience > 30 ? 'bg-yellow-500' : 'bg-red-500');
  }
  // Emoji feedback
  const moodEmoji = document.getElementById('mood-emoji');
  if (moodEmoji) {
    moodEmoji.textContent = mood > 60 ? '😊' : mood > 30 ? '😐' : '😢';
  }
  const patienceEmoji = document.getElementById('patience-emoji');
  if (patienceEmoji) {
    patienceEmoji.textContent = patience > 60 ? '🧘' : patience > 30 ? '😓' : '😫';
  }
}

// --- HTMX Integration ---
function onHTMXSwap() {
  // Only run on scenario or outcome screens
  if (document.getElementById('timer-bar')) {
    startScenarioTimer(10);
  } else {
    stopScenarioTimer();
  }
  updateStatusBars();
}

// --- Expose for server-side inline scripts ---
window.parentingApp = {
  saveProgress,
  loadProgress,
  clearProgress,
  updateStatusBars,
  startScenarioTimer,
  stopScenarioTimer
};

// --- DOM Ready Handler ---
function domReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

domReady(() => {
  updateStatusBars();
  if (document.getElementById('timer-bar')) {
    startScenarioTimer(10);
  }
  // Listen for HTMX swaps
  document.body.addEventListener('htmx:afterSwap', onHTMXSwap);
}); 
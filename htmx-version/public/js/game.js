// Game state
let currentTimerId = null;
let isTimeoutReached = false;

// Timer functionality with progress bar
function startTimer(duration) {
    let timeLeft = duration;
    const timerBar = document.getElementById('timer-bar');
    const timeoutNotice = document.getElementById('timeout-notice');
    const parentingTip = document.getElementById('parenting-tip');
    const tickSound = document.getElementById('tickSound');
    
    // Reset state
    isTimeoutReached = false;
    timerBar.style.width = '100%';
    timerBar.className = 'h-full bg-green-500 transition-all duration-1000';
    timeoutNotice.classList.add('opacity-0');
    parentingTip.classList.add('opacity-0');

    const updateTimerVisuals = (time) => {
        const progress = (time / duration) * 100;
        timerBar.style.width = `${progress}%`;
        
        // Update color based on time remaining
        if (progress <= 30) {
            timerBar.className = 'h-full bg-red-500 transition-all duration-1000';
        } else if (progress <= 60) {
            timerBar.className = 'h-full bg-yellow-500 transition-all duration-1000';
        }

        // Show parenting tip at halfway point
        if (progress <= 50 && parentingTip.classList.contains('opacity-0')) {
            parentingTip.classList.remove('opacity-0');
            parentingTip.classList.add('opacity-100');
        }

        // Play tick sound for last 3 seconds
        if (time <= 3) {
            tickSound.play();
        }
    };

    const updateChildStatus = () => {
        if (isTimeoutReached) {
            const moodMeter = document.getElementById('mood-meter');
            const currentWidth = parseFloat(moodMeter.style.width);
            const newWidth = Math.max(0, currentWidth - 0.5);
            moodMeter.style.width = `${newWidth}%`;
            updateEmoji(newWidth, 'mood');
        }
    };

    // Clear any existing timer
    if (currentTimerId) {
        clearInterval(currentTimerId);
    }

    // Start new timer
    currentTimerId = setInterval(() => {
        timeLeft--;
        updateTimerVisuals(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(currentTimerId);
            document.getElementById('timeoutSound').play();
            isTimeoutReached = true;
            
            // Show timeout notice
            timeoutNotice.classList.remove('opacity-0');
            timeoutNotice.classList.add('opacity-100');
            
            // Start decreasing child's mood
            setInterval(updateChildStatus, 1000);
        }
    }, 1000);

    // Store timer ID for cleanup
    document.querySelector('#scenario').dataset.timerId = currentTimerId;
}

// Update emoji based on meter values
function updateEmoji(meterValue, type) {
    const emojis = type === 'mood' 
        ? ['😢', '😕', '😐', '🙂', '😊']
        : ['😫', '😓', '😌', '🧘', '🧘‍♂️'];
    
    const index = Math.floor((meterValue / 100) * (emojis.length - 1));
    document.getElementById(`${type}-emoji`).textContent = emojis[index];
}

// HTMX event handlers
htmx.on('htmx:afterSwap', (evt) => {
    if (evt.detail.target.id === 'scenario') {
        const oldTimerId = evt.detail.target.dataset.timerId;
        if (oldTimerId) clearInterval(parseInt(oldTimerId));
        
        // Only start timer if it's not an outcome view
        if (!evt.detail.target.classList.contains('outcome-view')) {
            startTimer(10);
            isTimeoutReached = false;
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    startTimer(10);
}); 
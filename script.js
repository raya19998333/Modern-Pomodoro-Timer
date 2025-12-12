const MODES = { pomodoro: 25 * 60, short: 5 * 60, long: 15 * 60 };
const COLORS = { pomodoro: '#ffffffff', short: '#f5d59fff', long: '#b4cdc5ff' };
const QUOTES = [
  'Keep it simple, stupid!',
  'Debugging is like being a detective.',
  'Code never lies, comments sometimes do.',
  'Commit often, break rarely.',
  'Write tests, save time.',
];

let currentMode = 'pomodoro',
  timeLeft = MODES[currentMode],
  totalTime = MODES[currentMode];
let isRunning = false,
  timerInterval = null,
  pomodorosCompleted = 0,
  totalMinutes = 0;

const timeDisplay = document.getElementById('timeDisplay');
const playPauseBtn = document.getElementById('playPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timerDisplayEl = document.getElementById('timerDisplay');
const progressCircle = document.getElementById('progressCircle');
const pomodorosCount = document.getElementById('pomodorosCount');
const totalTimeEl = document.getElementById('totalTime');
const modeBtns = document.querySelectorAll('.mode-btn');
const quoteEl = document.getElementById('quote');

const radius = 130;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = circumference;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(timeLeft);
  const progress = 1 - timeLeft / totalTime;
  progressCircle.style.stroke = COLORS[currentMode];
  progressCircle.style.strokeDashoffset =
    circumference - progress * circumference;
}

function playSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 800;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.5);
}

function showQuote() {
  quoteEl.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

function startTimer() {
  isRunning = true;
  timerDisplayEl.classList.add('running');
  playPauseBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="#667eea"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    if (timeLeft === 0) {
      stopTimer();
      playSound();
      showQuote();
      if (currentMode === 'pomodoro') {
        pomodorosCompleted++;
        totalMinutes += 25;
        pomodorosCount.textContent = pomodorosCompleted;
        totalTimeEl.textContent = `${totalMinutes}m`;
      }
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body:
            currentMode === 'pomodoro' ? 'Time for a break!' : 'Break is over!',
          icon: '🍅',
        });
      }
    }
  }, 1000);
}

function stopTimer() {
  isRunning = false;
  timerDisplayEl.classList.remove('running');
  playPauseBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="#dedee0ff"><path d="M8 5v14l11-7z"/></svg>';
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  timeLeft = MODES[currentMode];
  totalTime = MODES[currentMode];
  updateDisplay();
}

playPauseBtn.addEventListener('click', () => {
  isRunning ? stopTimer() : startTimer();
});
resetBtn.addEventListener('click', resetTimer);

modeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    modeBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    resetTimer();
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    isRunning ? stopTimer() : startTimer();
  }
  if (e.code === 'KeyR') {
    resetTimer();
  }
  if (e.code === 'Digit1') {
    currentMode = 'pomodoro';
    modeBtns[0].click();
  }
  if (e.code === 'Digit2') {
    currentMode = 'short';
    modeBtns[1].click();
  }
  if (e.code === 'Digit3') {
    currentMode = 'long';
    modeBtns[2].click();
  }
});

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}
updateDisplay();
// إنشاء 50 جزيء متوهج بشكل عشوائي
for(let i=0; i<50; i++){
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random()*100 + 'vw';
    particle.style.top = Math.random()*100 + 'vh';
    particle.style.animationDuration = 5 + Math.random()*10 + 's';
    document.body.appendChild(particle);
}

// إنشاء أو إضافة الشاورض (Orbs) في حال أردت إضافتها ديناميكياً
const orbPositions = [
    {width: 200, height:200, top: "10%", left:"15%", duration:25},
    {width: 150, height:150, top: "50%", left:"70%", duration:30},
    {width: 250, height:250, top: "70%", left:"40%", duration:35}
];

orbPositions.forEach(pos => {
    const orb = document.createElement('div');
    orb.classList.add('orb');
    orb.style.width = pos.width + "px";
    orb.style.height = pos.height + "px";
    orb.style.top = pos.top;
    orb.style.left = pos.left;
    orb.style.animationDuration = pos.duration + "s";
    document.body.appendChild(orb);
});

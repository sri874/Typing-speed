// Text samples for each language
const textSamples = {
    english: [
        "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice. Learning to type faster will help you become more productive in your daily work and studies.",
        "Technology has transformed the way we live and work. From smartphones to artificial intelligence, innovation continues to shape our future. Embracing these changes while maintaining our human connections is essential for a balanced life.",
        "The beauty of nature inspires artists and poets around the world. Mountains touch the sky while rivers flow to the sea. Every sunrise brings new hope and every sunset reminds us to be grateful for another day.",
        "Reading books opens doors to new worlds and ideas. Whether fiction or non-fiction, each page teaches us something valuable. Make reading a daily habit and watch your knowledge grow exponentially over time."
    ],
    hindi: [
        "भारत एक महान देश है। यहाँ की संस्कृति और परंपराएं पूरे विश्व में प्रसिद्ध हैं। हमारे देश में विभिन्न भाषाएं बोली जाती हैं और यहाँ के लोग मिलजुल कर रहते हैं।",
        "शिक्षा जीवन की सबसे बड़ी पूंजी है। पढ़ाई करने से हमें ज्ञान मिलता है और हम बेहतर इंसान बनते हैं। हर बच्चे को अच्छी शिक्षा मिलनी चाहिए।",
        "प्रकृति की सुंदरता अद्भुत है। पहाड़, नदियाँ, और हरे भरे जंगल हमारी धरती को सुंदर बनाते हैं। हमें प्रकृति की रक्षा करनी चाहिए।",
        "स्वस्थ जीवन के लिए नियमित व्यायाम और संतुलित आहार बहुत जरूरी है। सुबह जल्दी उठना और योग करना शरीर को स्वस्थ रखता है।"
    ],
    tamil: [
        "தமிழ் மிகவும் பழமையான மொழி. இது உலகின் மிகப் பழமையான மொழிகளில் ஒன்று. தமிழ் இலக்கியம் மிகவும் செழுமையானது.",
        "கல்வி மிகவும் முக்கியம். படிப்பு நமக்கு அறிவை தருகிறது. நல்ல கல்வி பெற்றவர்கள் வாழ்க்கையில் வெற்றி பெறுவார்கள்.",
        "இயற்கை மிகவும் அழகானது. மலைகள், நதிகள், காடுகள் நம் பூமியை அழகாக மாற்றுகின்றன. இயற்கையை பாதுகாப்பது நம் கடமை.",
        "உடல் நலம் பெரும் செல்வம். தினமும் உடற்பயிற்சி செய்வது ஆரோக்கியத்திற்கு நல்லது. நல்ல உணவு உண்பது அவசியம்."
    ]
};

// DOM Elements
const languageSelect = document.getElementById('language');
const textDisplay = document.getElementById('textDisplay');
const inputField = document.getElementById('inputField');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const charactersElement = document.getElementById('characters');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const resultContainer = document.getElementById('resultContainer');
const finalWpm = document.getElementById('finalWpm');
const finalAccuracy = document.getElementById('finalAccuracy');
const finalChars = document.getElementById('finalChars');
const tryAgainBtn = document.getElementById('tryAgainBtn');

// Game state
let currentText = '';
let timeLeft = 60;
let timerInterval = null;
let isTestRunning = false;
let totalCharacters = 0;
let correctCharacters = 0;

// Initialize the app
function init() {
    loadNewText();
    setupEventListeners();
}

// Load new text based on selected language
function loadNewText() {
    const language = languageSelect.value;
    const samples = textSamples[language];
    currentText = samples[Math.floor(Math.random() * samples.length)];
    
    // Apply language-specific font class
    textDisplay.className = 'text-display';
    inputField.className = '';
    
    if (language === 'hindi') {
        textDisplay.classList.add('hindi-text');
        inputField.classList.add('hindi-text');
    } else if (language === 'tamil') {
        textDisplay.classList.add('tamil-text');
        inputField.classList.add('tamil-text');
    }
    
    displayText();
}

// Display the text with character spans
function displayText() {
    textDisplay.innerHTML = currentText
        .split('')
        .map((char, index) => `<span class="char" data-index="${index}">${char}</span>`)
        .join('');
}

// Setup event listeners
function setupEventListeners() {
    languageSelect.addEventListener('change', () => {
        if (!isTestRunning) {
            loadNewText();
        }
    });
    
    startBtn.addEventListener('click', startTest);
    resetBtn.addEventListener('click', resetTest);
    tryAgainBtn.addEventListener('click', resetTest);
    
    inputField.addEventListener('input', handleInput);
    inputField.addEventListener('keydown', handleKeyDown);
}

// Start the typing test
function startTest() {
    if (isTestRunning) return;
    
    isTestRunning = true;
    inputField.disabled = false;
    inputField.value = '';
    inputField.focus();
    
    // Reset stats
    totalCharacters = 0;
    correctCharacters = 0;
    timeLeft = 60;
    
    // Update UI
    startBtn.innerHTML = '<span>⏳</span> Running...';
    startBtn.disabled = true;
    languageSelect.disabled = true;
    resultContainer.style.display = 'none';
    
    // Start timer
    timerInterval = setInterval(updateTimer, 1000);
    
    // Reset display
    displayText();
    updateStats();
}

// Update timer
function updateTimer() {
    timeLeft--;
    timerElement.textContent = timeLeft;
    
    // Update WPM during test
    updateWPM();
    
    if (timeLeft <= 0) {
        endTest();
    }
    
    // Timer warning colors
    if (timeLeft <= 10) {
        timerElement.style.color = '#ef4444';
    } else if (timeLeft <= 30) {
        timerElement.style.color = '#f59e0b';
    }
}

// Handle input
function handleInput(e) {
    if (!isTestRunning) return;
    
    const inputText = inputField.value;
    const chars = textDisplay.querySelectorAll('.char');
    
    totalCharacters = inputText.length;
    correctCharacters = 0;
    
    // Check each character
    chars.forEach((charSpan, index) => {
        charSpan.classList.remove('correct', 'incorrect', 'current');
        
        if (index < inputText.length) {
            if (inputText[index] === currentText[index]) {
                charSpan.classList.add('correct');
                correctCharacters++;
            } else {
                charSpan.classList.add('incorrect');
            }
        } else if (index === inputText.length) {
            charSpan.classList.add('current');
        }
    });
    
    updateStats();
    
    // Check if user completed the text
    if (inputText.length >= currentText.length) {
        endTest();
    }
}

// Handle special key presses
function handleKeyDown(e) {
    // Prevent tab from leaving the input
    if (e.key === 'Tab') {
        e.preventDefault();
    }
}

// Update live stats
function updateStats() {
    charactersElement.textContent = totalCharacters;
    
    // Calculate accuracy
    const accuracy = totalCharacters > 0 
        ? Math.round((correctCharacters / totalCharacters) * 100) 
        : 100;
    accuracyElement.textContent = accuracy;
    
    updateWPM();
}

// Calculate and update WPM
function updateWPM() {
    const timeElapsed = 60 - timeLeft;
    if (timeElapsed > 0) {
        // WPM = (characters typed / 5) / minutes elapsed
        // Using correct characters for accurate WPM
        const wpm = Math.round((correctCharacters / 5) / (timeElapsed / 60));
        wpmElement.textContent = wpm;
    }
}

// End the typing test
function endTest() {
    isTestRunning = false;
    clearInterval(timerInterval);
    
    inputField.disabled = true;
    startBtn.innerHTML = '<span>🚀</span> Start Test';
    startBtn.disabled = false;
    languageSelect.disabled = false;
    
    // Reset timer color
    timerElement.style.color = '';
    
    // Calculate final stats
    const timeElapsed = 60 - timeLeft;
    const finalWpmValue = timeElapsed > 0 
        ? Math.round((correctCharacters / 5) / (timeElapsed / 60)) 
        : 0;
    const finalAccuracyValue = totalCharacters > 0 
        ? Math.round((correctCharacters / totalCharacters) * 100) 
        : 0;
    
    // Show results
    finalWpm.textContent = finalWpmValue;
    finalAccuracy.textContent = finalAccuracyValue + '%';
    finalChars.textContent = totalCharacters;
    
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// Reset the test
function resetTest() {
    isTestRunning = false;
    clearInterval(timerInterval);
    
    // Reset all values
    timeLeft = 60;
    totalCharacters = 0;
    correctCharacters = 0;
    
    // Reset UI
    timerElement.textContent = '60';
    timerElement.style.color = '';
    wpmElement.textContent = '0';
    accuracyElement.textContent = '100';
    charactersElement.textContent = '0';
    
    inputField.value = '';
    inputField.disabled = true;
    
    startBtn.innerHTML = '<span>🚀</span> Start Test';
    startBtn.disabled = false;
    languageSelect.disabled = false;
    
    resultContainer.style.display = 'none';
    
    // Load new text
    loadNewText();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

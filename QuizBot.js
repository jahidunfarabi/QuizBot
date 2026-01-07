
const appState = {
    selectedTopics: new Set(['javascript', 'html', 'css']),
    difficulty: 'intermediate',
    quizMode: 'practice',
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    score: 0,
    totalQuestions: 5
};

// DOM Elements
const elements = {
    topicList: document.getElementById('topic-list'),
    difficultyButtons: document.querySelectorAll('.difficulty-btn'),
    modeButtons: document.querySelectorAll('.mode-btn'),
    generateBtn: document.getElementById('generate-btn'),
    welcomeScreen: document.getElementById('welcome-screen'),
    quizContainer: document.getElementById('quiz-container'),
    resultsContainer: document.getElementById('results-container'),
    loadingScreen: document.getElementById('loading-screen'),
    questionCountInput: document.getElementById('question-count'),
    decreaseBtn: document.getElementById('decrease-btn'),
    increaseBtn: document.getElementById('increase-btn')
};

// Topic Data
const topicsData = [
    { id: 'javascript', name: 'JavaScript', icon: 'fab fa-js' },
    { id: 'html', name: 'HTML', icon: 'fab fa-html5' },
    { id: 'css', name: 'CSS', icon: 'fab fa-css3-alt' },
    { id: 'react', name: 'React', icon: 'fab fa-react' },
    { id: 'dom', name: 'DOM Manipulation', icon: 'fas fa-code' },
    { id: 'es6', name: 'ES6+ Features', icon: 'fas fa-bolt' },
    { id: 'async', name: 'Async/Await', icon: 'fas fa-sync-alt' },
    { id: 'responsive', name: 'Responsive Design', icon: 'fas fa-mobile-alt' },
    { id: 'accessibility', name: 'Accessibility', icon: 'fas fa-universal-access' },
    { id: 'testing', name: 'Testing', icon: 'fas fa-vial' }
];

// Question Database
const questionDatabase = {
    javascript: [
        {
            question: "What will be the output of: console.log(2 + '2' - 1);?",
            options: ["21", "3", "221", "Error"],
            correctAnswer: 0,
            explanation: "First '2' + '2' becomes '22', then '22' - 1 becomes 21 in JavaScript.",
            difficulty: 'beginner',
            code: "console.log(2 + '2' - 1);"
        },
        {
            question: "What does the 'this' keyword refer to in a regular function?",
            options: ["The function itself", "The global object", "The parent object", "Undefined"],
            correctAnswer: 1,
            explanation: "In regular functions, 'this' refers to the global object (window in browsers).",
            difficulty: 'intermediate',
            code: "function test() {\n  console.log(this);\n}"
        },
        {
            question: "What is the output of this closure example?",
            options: ["0,1,2", "3,3,3", "0,1,2,3", "Error"],
            correctAnswer: 1,
            explanation: "Due to closure and setTimeout, all functions reference the same i variable which becomes 3.",
            difficulty: 'advanced',
            code: "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}"
        }
    ],
    html: [
        {
            question: "Which HTML5 element represents the main content of a document?",
            options: ["<main>", "<content>", "<body>", "<section>"],
            correctAnswer: 0,
            explanation: "The <main> element represents the dominant content of the body of a document.",
            difficulty: 'beginner'
        },
        {
            question: "What is the purpose of the 'defer' attribute in script tags?",
            options: [
                "Delay script execution until HTML is parsed",
                "Execute script asynchronously",
                "Prevent script from loading",
                "Optimize script for mobile"
            ],
            correctAnswer: 0,
            explanation: "The 'defer' attribute delays script execution until the HTML document has been fully parsed.",
            difficulty: 'intermediate'
        },
        {
            question: "Which attribute improves accessibility for screen readers?",
            options: ["aria-label", "data-label", "alt-label", "access-label"],
            correctAnswer: 0,
            explanation: "The aria-label attribute provides an accessible name for elements.",
            difficulty: 'advanced'
        }
    ],
    css: [
        {
            question: "What does CSS Grid's 'fr' unit stand for?",
            options: ["Fraction", "Frame", "Free", "Flex"],
            correctAnswer: 0,
            explanation: "The 'fr' unit represents a fraction of the available space in the grid container.",
            difficulty: 'beginner'
        },
        {
            question: "Which CSS property creates a smooth transition effect?",
            options: ["transition", "animation", "transform", "smooth"],
            correctAnswer: 0,
            explanation: "The transition property creates smooth transitions between property values.",
            difficulty: 'intermediate',
            code: ".box {\n  transition: all 0.3s ease;\n}"
        },
        {
            question: "What does 'will-change' property do?",
            options: [
                "Hints browsers about upcoming changes",
                "Forces immediate repaint",
                "Prevents animations",
                "Changes element properties"
            ],
            correctAnswer: 0,
            explanation: "The will-change property hints browsers about what properties will change.",
            difficulty: 'advanced'
        }
    ]
};

// Initialize the application
function initApp() {
    renderTopics();
    setupEventListeners();
    showWelcomeScreen();
}

// Render topic selection list
function renderTopics() {
    elements.topicList.innerHTML = '';
    
    topicsData.forEach(topic => {
        const isSelected = appState.selectedTopics.has(topic.id);
        const topicItem = document.createElement('div');
        topicItem.className = `topic-item ${isSelected ? 'selected' : ''}`;
        topicItem.dataset.id = topic.id;
        
        topicItem.innerHTML = `
            <div class="topic-info">
                <i class="${topic.icon} topic-icon"></i>
                <span class="topic-name">${topic.name}</span>
            </div>
            <div class="topic-check">
                <i class="fas fa-${isSelected ? 'check-circle' : 'plus-circle'}"></i>
            </div>
        `;
        
        topicItem.addEventListener('click', () => toggleTopic(topic.id));
        elements.topicList.appendChild(topicItem);
    });
}

// Toggle topic selection
function toggleTopic(topicId) {
    if (appState.selectedTopics.has(topicId)) {
        appState.selectedTopics.delete(topicId);
    } else {
        appState.selectedTopics.add(topicId);
    }
    renderTopics();
}

// Set up all event listeners
function setupEventListeners() {
    // Difficulty buttons
    elements.difficultyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            elements.difficultyButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            appState.difficulty = this.dataset.level;
        });
    });

    // Mode buttons
    elements.modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            elements.modeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            appState.quizMode = this.id.replace('-mode', '');
        });
    });

    // Question count controls
    elements.decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(elements.questionCountInput.value) || 5;
        if (currentValue > 3) {
            elements.questionCountInput.value = currentValue - 1;
        }
    });

    elements.increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(elements.questionCountInput.value) || 5;
        if (currentValue < 15) {
            elements.questionCountInput.value = currentValue + 1;
        }
    });

    // Generate quiz button
    elements.generateBtn.addEventListener('click', generateQuiz);
}

// Show welcome screen
function showWelcomeScreen() {
    hideAllScreens();
    elements.welcomeScreen.style.display = 'block';
}

// Generate quiz questions
function generateQuiz() {
    // Validate topic selection
    if (appState.selectedTopics.size === 0) {
        showAlert('Please select at least one topic!', 'warning');
        return;
    }

    // Get question count
    appState.totalQuestions = parseInt(elements.questionCountInput.value) || 5;
    
    // Show loading screen
    hideAllScreens();
    elements.loadingScreen.style.display = 'flex';
    
    // Simulate AI generation with timeout
    setTimeout(() => {
        // Generate questions
        appState.questions = generateQuestions();
        appState.currentQuestionIndex = 0;
        appState.userAnswers = new Array(appState.questions.length).fill(null);
        appState.score = 0;
        
        // Hide loading and show quiz
        elements.loadingScreen.style.display = 'none';
        elements.quizContainer.style.display = 'block';
        
        // Render first question
        renderQuestion();
    }, 1500);
}

// Generate questions based on selection
function generateQuestions() {
    const questions = [];
    const selectedTopicsArray = Array.from(appState.selectedTopics);
    
    // Calculate questions per topic
    const questionsPerTopic = Math.ceil(appState.totalQuestions / selectedTopicsArray.length);
    
    selectedTopicsArray.forEach(topic => {
        if (questionDatabase[topic]) {
            const topicQuestions = questionDatabase[topic].filter(q => 
                q.difficulty === appState.difficulty
            );
            
            // Add questions from this topic
            const questionsToAdd = Math.min(questionsPerTopic, topicQuestions.length);
            for (let i = 0; i < questionsToAdd && questions.length < appState.totalQuestions; i++) {
                const randomIndex = Math.floor(Math.random() * topicQuestions.length);
                const question = {...topicQuestions[randomIndex]};
                question.topic = topic;
                questions.push(question);
            }
        }
    });
    
    // Shuffle questions
    return shuffleArray(questions).slice(0, appState.totalQuestions);
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Render current question
function renderQuestion() {
    if (appState.questions.length === 0) {
        showWelcomeScreen();
        return;
    }

    const question = appState.questions[appState.currentQuestionIndex];
    const questionNumber = appState.currentQuestionIndex + 1;
    const totalQuestions = appState.questions.length;
    const userAnswer = appState.userAnswers[appState.currentQuestionIndex];
    
    // Build options HTML
    let optionsHTML = '';
    const optionLetters = ['A', 'B', 'C', 'D'];
    
    question.options.forEach((option, index) => {
        let optionClass = 'option';
        if (userAnswer === index) {
            optionClass += ' selected';
        }
        
        optionsHTML += `
            <div class="${optionClass}" data-index="${index}">
                <div class="option-letter">${optionLetters[index]}</div>
                <div>${option}</div>
            </div>
        `;
    });
    
    // Build code snippet HTML if exists
    const codeHTML = question.code ? `
        <div class="code-snippet">
            <pre>${question.code}</pre>
        </div>
    ` : '';
    
    // Build quiz HTML
    const quizHTML = `
        <div class="quiz-header">
            <div class="quiz-info">
                <h2>${topicsData.find(t => t.id === question.topic).name}</h2>
                <p>${appState.difficulty.charAt(0).toUpperCase() + appState.difficulty.slice(1)} Level</p>
            </div>
            <div class="question-counter">
                <div class="counter-circle">${questionNumber}/${totalQuestions}</div>
                <span>Question ${questionNumber} of ${totalQuestions}</span>
            </div>
        </div>
        
        <div class="question-area">
            <div class="question-text">${question.question}</div>
            ${codeHTML}
            <div class="options-container" id="options-container">
                ${optionsHTML}
            </div>
            
            <div class="feedback-area" id="feedback-area" style="display: none;">
                <div class="feedback-title">
                    <i class="fas fa-info-circle"></i>
                    <strong>Explanation</strong>
                </div>
                <div class="feedback-text" id="feedback-text">
                    ${question.explanation}
                </div>
            </div>
        </div>
        
        <div class="quiz-controls">
            <button class="quiz-btn" id="check-btn" ${userAnswer === null ? 'disabled' : ''}>
                <i class="fas fa-check"></i> Check Answer
            </button>
            
            ${appState.currentQuestionIndex < appState.questions.length - 1 
                ? `<button class="quiz-btn" id="next-btn">Next <i class="fas fa-arrow-right"></i></button>`
                : `<button class="quiz-btn" id="show-results-btn">Show Results <i class="fas fa-chart-bar"></i></button>`
            }
        </div>
    `;
    
    elements.quizContainer.innerHTML = quizHTML;
    setupQuizEventListeners();
}

// Set up quiz event listeners
function setupQuizEventListeners() {
    // Option selection
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('selected')) return;
            
            // Remove selected class from all options
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Store user's answer
            const selectedIndex = parseInt(this.dataset.index);
            appState.userAnswers[appState.currentQuestionIndex] = selectedIndex;
            
            // Enable check button
            document.getElementById('check-btn').disabled = false;
        });
    });
    
    // Check answer button
    document.getElementById('check-btn').addEventListener('click', checkAnswer);
    
    // Next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            appState.currentQuestionIndex++;
            renderQuestion();
        });
    }
    
    // Show results button
    const showResultsBtn = document.getElementById('show-results-btn');
    if (showResultsBtn) {
        showResultsBtn.addEventListener('click', showResults);
    }
}

// Check current answer
function checkAnswer() {
    const question = appState.questions[appState.currentQuestionIndex];
    const userAnswer = appState.userAnswers[appState.currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    const feedbackArea = document.getElementById('feedback-area');
    const checkBtn = document.getElementById('check-btn');
    
    // Mark correct and incorrect answers
    options.forEach((option, index) => {
        if (index === question.correctAnswer) {
            option.classList.add('correct');
        } else if (index === userAnswer && index !== question.correctAnswer) {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none';
    });
    
    // Update score if correct
    if (userAnswer === question.correctAnswer) {
        appState.score++;
    }
    
    // Show feedback
    feedbackArea.style.display = 'block';
    
    // Disable check button
    checkBtn.disabled = true;
    
    // Add confetti effect for correct answer
    if (userAnswer === question.correctAnswer) {
        createConfetti();
    }
}

// Show results screen
function showResults() {
    const totalQuestions = appState.questions.length;
    const percentage = Math.round((appState.score / totalQuestions) * 100);
    
    // Determine performance message
    let performanceMessage = '';
    let performanceIcon = '';
    
    if (percentage >= 90) {
        performanceMessage = '🏆 Outstanding! You have mastered these topics!';
        performanceIcon = 'fas fa-trophy';
    } else if (percentage >= 70) {
        performanceMessage = '🌟 Great job! You have a solid understanding.';
        performanceIcon = 'fas fa-star';
    } else if (percentage >= 50) {
        performanceMessage = '👍 Good effort! Keep practicing to improve.';
        performanceIcon = 'fas fa-thumbs-up';
    } else {
        performanceMessage = '📚 Keep learning! Review these topics and try again.';
        performanceIcon = 'fas fa-book';
    }
    
    // Calculate performance by topic
    const topicPerformance = {};
    appState.questions.forEach((question, index) => {
        const topic = question.topic;
        if (!topicPerformance[topic]) {
            topicPerformance[topic] = { total: 0, correct: 0 };
        }
        topicPerformance[topic].total++;
        if (appState.userAnswers[index] === question.correctAnswer) {
            topicPerformance[topic].correct++;
        }
    });
    
    // Build topic performance HTML
    let topicPerformanceHTML = '';
    Object.keys(topicPerformance).forEach(topic => {
        const perf = topicPerformance[topic];
        const topicPercentage = Math.round((perf.correct / perf.total) * 100);
        const topicName = topicsData.find(t => t.id === topic).name;
        
        topicPerformanceHTML += `
            <div class="topic-performance-item">
                <strong>${topicName}:</strong> ${perf.correct}/${perf.total} (${topicPercentage}%)
            </div>
        `;
    });
    
    // Build results HTML
    const resultsHTML = `
        <div class="results-content">
            <div class="result-icon">
                <i class="${performanceIcon}"></i>
            </div>
            <div class="result-score">${appState.score}/${totalQuestions}</div>
            <div class="result-message">${performanceMessage}</div>
            
            <div class="result-details">
                <h3>
                    <i class="fas fa-chart-pie"></i>
                    Performance by Topic
                </h3>
                <div class="topic-performance">
                    ${topicPerformanceHTML}
                </div>
            </div>
            
            <button class="restart-btn" id="restart-btn">
                <i class="fas fa-redo"></i> Start New Quiz
            </button>
        </div>
    `;
    
    hideAllScreens();
    elements.resultsContainer.style.display = 'block';
    elements.resultsContainer.innerHTML = resultsHTML;
    
    // Add event listener to restart button
    document.getElementById('restart-btn').addEventListener('click', () => {
        showWelcomeScreen();
    });
}

// Hide all screens
function hideAllScreens() {
    elements.welcomeScreen.style.display = 'none';
    elements.quizContainer.style.display = 'none';
    elements.resultsContainer.style.display = 'none';
    elements.loadingScreen.style.display = 'none';
}

// Show alert message
function showAlert(message, type = 'info') {
    // Create alert element
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type}`;
    alertEl.innerHTML = `
        <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
    `;
    
    // Add to body
    document.body.appendChild(alertEl);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alertEl.remove();
    }, 3000);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#6C63FF', '#FF6584', '#36D1DC', '#10B981', '#F59E0B'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '0';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Remove after animation
        setTimeout(() => confetti.remove(), 2000);
    }
}

// Add alert styles dynamically
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    .alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: var(--card-bg);
        border-left: 4px solid var(--primary-color);
        border-radius: 8px;
        color: var(--text-color);
        font-weight: 500;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 20px var(--shadow-color);
        animation: slideIn 0.3s ease;
    }
    
    .alert-warning {
        border-left-color: var(--warning-color);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(alertStyles);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
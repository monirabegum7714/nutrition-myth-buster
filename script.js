// ===========================
// MYTHS DATA
// ===========================

const mythsData = [
    {
        myth: "Carbs make you fat.",
        truth: "Not all carbs are bad! Complex carbs like whole grains, vegetables, and legumes are essential for energy and health. It's excess calories that lead to weight gain, not carbs specifically.",
        icon: "🍞"
    },
    {
        myth: "Late-night eating is always bad.",
        truth: "Timing matters less than total daily calories. Eating late at night is fine if you're hungry and maintain a balanced diet. The key is portion control, not the clock.",
        icon: "🌙"
    },
    {
        myth: "Detox juices cleanse your body.",
        truth: "Your liver and kidneys already detoxify your body naturally. There's no scientific evidence that detox juices remove toxins. A balanced diet and hydration are more beneficial.",
        icon: "🧃"
    },
    {
        myth: "High-protein diets damage kidneys.",
        truth: "For healthy individuals, high protein doesn't damage kidneys. People with kidney disease need to monitor intake, but healthy kidneys can handle extra protein without issues.",
        icon: "💪"
    },
    {
        myth: "Fat-free foods are always healthier.",
        truth: "Fat is essential for nutrient absorption and hormone production. Fat-free products often have added sugar. Healthy fats from avocados, nuts, and fish are beneficial.",
        icon: "🥑"
    }
];

// ===========================
// QUIZ DATA
// ===========================

const quizData = [
    {
        question: "True or False: Eating fat makes you fat.",
        answer: false,
        explanation: "False! Healthy fats are essential for your body. It's about balance and portion sizes, not avoiding fat entirely."
    },
    {
        question: "True or False: You need to eat 8 glasses of water daily.",
        answer: false,
        explanation: "False! Water needs vary by person, activity level, and climate. Just drink when thirsty and monitor urine color."
    },
    {
        question: "True or False: Protein helps build and repair muscles.",
        answer: true,
        explanation: "True! Protein is essential for muscle growth and repair. Combined with exercise, it helps build strength."
    },
    {
        question: "True or False: All calories are equal regardless of source.",
        answer: false,
        explanation: "False! While calories matter for weight, the source matters for health. 100 cal of broccoli ≠ 100 cal of candy."
    },
    {
        question: "True or False: Skipping breakfast boosts metabolism.",
        answer: false,
        explanation: "False! Skipping breakfast doesn't boost metabolism. A healthy breakfast helps maintain energy and focus."
    }
];

// ===========================
// STATE MANAGEMENT
// ===========================

const state = {
    currentQuestionIndex: 0,
    score: 0,
    answered: false,
    selectedAnswer: null
};

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initializeMythCards();
    initializeQuiz();
    setupNavigation();
    setupAnimationCanvas();
});

// ===========================
// MYTH CARDS FUNCTIONALITY
// ===========================

function initializeMythCards() {
    const mythsGrid = document.querySelector('.myths-grid');
    
    mythsData.forEach((mythData, index) => {
        const card = createMythCard(mythData, index);
        mythsGrid.appendChild(card);
    });
}

function createMythCard(mythData, index) {
    const card = document.createElement('div');
    card.className = 'myth-card';
    card.innerHTML = `
        <div class="myth-card-inner">
            <div class="myth-card-front">
                <h3>${mythData.myth}</h3>
                <p class="click-hint">Click to reveal the truth! 👇</p>
            </div>
            <div class="myth-card-back">
                <h3>The Truth:</h3>
                <p class="myth-truth">${mythData.truth}</p>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        
        // Trigger balloon pop animation
        if (card.classList.contains('flipped')) {
            triggerBalloonPop(card);
        }
    });
    
    return card;
}

// ===========================
// QUIZ FUNCTIONALITY
// ===========================

function initializeQuiz() {
    updateQuestionDisplay();
    setupQuizButtons();
}

function updateQuestionDisplay() {
    const currentQuestion = quizData[state.currentQuestionIndex];
    
    document.getElementById('questionText').textContent = currentQuestion.question;
    document.getElementById('currentQuestion').textContent = state.currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = quizData.length;
    document.getElementById('finalScore').textContent = state.score;
    document.getElementById('totalScore').textContent = quizData.length;
    
    // Update progress bar
    const progress = ((state.currentQuestionIndex + 1) / quizData.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Reset feedback and button states
    const feedbackMessage = document.getElementById('feedbackMessage');
    feedbackMessage.classList.remove('show', 'correct', 'incorrect');
    feedbackMessage.textContent = '';
    
    const quizButtons = document.querySelectorAll('.quiz-buttons .btn');
    quizButtons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('selected');
    });
    
    state.answered = false;
    state.selectedAnswer = null;
}

function setupQuizButtons() {
    const buttons = document.querySelectorAll('.quiz-buttons .btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (state.answered) return;
            
            const userAnswer = button.dataset.answer === 'true';
            const correctAnswer = quizData[state.currentQuestionIndex].answer;
            const isCorrect = userAnswer === correctAnswer;
            
            handleQuizAnswer(isCorrect, button);
        });
    });
}

function handleQuizAnswer(isCorrect, clickedButton) {
    state.answered = true;
    const feedbackMessage = document.getElementById('feedbackMessage');
    const quizButtons = document.querySelectorAll('.quiz-buttons .btn');
    const currentQuestion = quizData[state.currentQuestionIndex];
    
    // Update score
    if (isCorrect) {
        state.score++;
        feedbackMessage.classList.add('correct');
        feedbackMessage.textContent = `✅ Correct! ${currentQuestion.explanation}`;
        triggerConfetti(clickedButton);
    } else {
        feedbackMessage.classList.add('incorrect');
        feedbackMessage.textContent = `❌ Incorrect! ${currentQuestion.explanation}`;
        triggerShatter(clickedButton);
    }
    
    feedbackMessage.classList.add('show');
    
    // Disable all buttons
    quizButtons.forEach(btn => btn.disabled = true);
    
    // Move to next question
    setTimeout(() => {
        state.currentQuestionIndex++;
        
        if (state.currentQuestionIndex < quizData.length) {
            updateQuestionDisplay();
            setupQuizButtons();
        } else {
            showQuizResults();
        }
    }, 3000);
}

function showQuizResults() {
    document.querySelector('.quiz-card').style.display = 'none';
    document.querySelector('.quiz-results').classList.remove('hidden');
    
    // Calculate percentage
    const percentage = Math.round((state.score / quizData.length) * 100);
    document.getElementById('scorePercentage').textContent = percentage + '%';
    
    // Trigger celebration animation
    triggerConfetti(document.querySelector('.quiz-results'));
}

function resetQuiz() {
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.answered = false;
    state.selectedAnswer = null;
    
    document.querySelector('.quiz-card').style.display = 'block';
    document.querySelector('.quiz-results').classList.add('hidden');
    
    updateQuestionDisplay();
    setupQuizButtons();
}

document.addEventListener('DOMContentLoaded', () => {
    const retakeBtn = document.getElementById('retakeQuizBtn');
    if (retakeBtn) {
        retakeBtn.addEventListener('click', resetQuiz);
    }
});

// ===========================
// ANIMATION EFFECTS
// ===========================

const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

function setupAnimationCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Balloon Pop Animation
function triggerBalloonPop(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const balloonCount = 6;
    for (let i = 0; i < balloonCount; i++) {
        const angle = (i / balloonCount) * Math.PI * 2;
        const velocity = 3 + Math.random() * 2;
        
        drawBalloon(centerX, centerY, angle, velocity);
    }
}

function drawBalloon(startX, startY, angle, velocity) {
    const balloon = {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: 15,
        life: 1,
        decay: 0.02
    };
    
    const balloonColor = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8E72'][Math.floor(Math.random() * 5)];
    
    function animateBalloon() {
        balloon.x += balloon.vx;
        balloon.y += balloon.vy;
        balloon.vy += 0.15; // gravity
        balloon.life -= balloon.decay;
        
        if (balloon.life > 0) {
            ctx.globalAlpha = balloon.life;
            ctx.fillStyle = balloonColor;
            ctx.beginPath();
            ctx.arc(balloon.x, balloon.y, balloon.size * balloon.life, 0, Math.PI * 2);
            ctx.fill();
            
            requestAnimationFrame(animateBalloon);
        }
    }
    
    ctx.globalAlpha = 1;
    animateBalloon();
}

// Shatter Animation
function triggerShatter(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const shatterCount = 8;
    for (let i = 0; i < shatterCount; i++) {
        const angle = (i / shatterCount) * Math.PI * 2;
        const velocity = 4 + Math.random() * 3;
        
        drawShatter(centerX, centerY, angle, velocity);
    }
}

function drawShatter(startX, startY, angle, velocity) {
    const shatter = {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        life: 1,
        decay: 0.025
    };
    
    function animateShatter() {
        shatter.x += shatter.vx;
        shatter.y += shatter.vy;
        shatter.vy += 0.2; // gravity
        shatter.rotation += shatter.rotationSpeed;
        shatter.life -= shatter.decay;
        
        if (shatter.life > 0) {
            ctx.globalAlpha = shatter.life;
            ctx.fillStyle = '#FF6B6B';
            ctx.save();
            ctx.translate(shatter.x, shatter.y);
            ctx.rotate(shatter.rotation);
            ctx.fillRect(-6, -6, 12, 12);
            ctx.restore();
            
            requestAnimationFrame(animateShatter);
        }
    }
    
    ctx.globalAlpha = 1;
    animateShatter();
}

// Confetti Animation
function triggerConfetti(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const confettiCount = 12;
    for (let i = 0; i < confettiCount; i++) {
        const angle = (Math.random() - 0.5) * Math.PI;
        const velocity = 3 + Math.random() * 4;
        
        drawConfetti(centerX, centerY, angle, velocity);
    }
}

function drawConfetti(startX, startY, angle, velocity) {
    const confetti = {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        size: 6 + Math.random() * 4,
        life: 1,
        decay: 0.02
    };
    
    const confettiColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8E72', '#44A08D'];
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    
    function animateConfetti() {
        confetti.x += confetti.vx;
        confetti.y += confetti.vy;
        confetti.vy += 0.15; // gravity
        confetti.vx *= 0.98; // air resistance
        confetti.rotation += confetti.rotationSpeed;
        confetti.life -= confetti.decay;
        
        if (confetti.life > 0) {
            ctx.globalAlpha = confetti.life;
            ctx.fillStyle = color;
            ctx.save();
            ctx.translate(confetti.x, confetti.y);
            ctx.rotate(confetti.rotation);
            ctx.fillRect(-confetti.size / 2, -confetti.size / 2, confetti.size, confetti.size);
            ctx.restore();
            
            requestAnimationFrame(animateConfetti);
        }
    }
    
    ctx.globalAlpha = 1;
    animateConfetti();
}

// ===========================
// NAVIGATION FUNCTIONALITY
// ===========================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

// Smooth scroll enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add touch support for mobile card flip
document.addEventListener('touchend', (e) => {
    if (e.target.closest('.myth-card')) {
        // Already handled by click event
    }
});

// Prevent canvas animation conflicts
ctx.globalAlpha = 1;
// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    const currentTheme = html.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        html.removeAttribute('data-theme');
        if (icon) icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        if (icon) icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
    updateNavbarContrast();
}

// Language Toggle
let currentLang = 'en';

function applyLanguage() {
    const langBtnText = document.getElementById('langText');
    if (langBtnText) langBtnText.textContent = currentLang === 'en' ? 'BM' : 'EN';
    
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute('data-' + currentLang);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                if (element.querySelector && element.querySelector('i')) {
                    const icon = element.querySelector('i');
                    element.textContent = '';
                    element.appendChild(icon);
                    element.append(' ' + text);
                } else {
                    element.textContent = text;
                }
            }
        }
    });
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ms' : 'en';
    applyLanguage();
    localStorage.setItem('language', currentLang);
}

// Initialize theme and language on load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const icon = document.getElementById('themeIcon');
        if (icon) icon.className = 'fas fa-sun';
    }

    const savedLang = localStorage.getItem('language');
    currentLang = savedLang === 'ms' ? 'ms' : 'en';
    applyLanguage();

    const scBtn = document.getElementById('scrollToTopBtn');
    if (scBtn) scBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
    
    updateNavbarContrast();
    window.addEventListener('scroll', updateNavbarContrast);
    window.addEventListener('resize', updateNavbarContrast);
});

function updateNavbarContrast() {
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero-section');
    if (!navbar || !hero) return;
    
    const heroRect = hero.getBoundingClientRect();
    const navHeight = navbar.offsetHeight || 60;
    const isOverHero = heroRect.bottom > navHeight;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // In light mode, if navbar is over hero, we use 'over-hero' class to keep text white
    if (isOverHero && !isDark) {
        navbar.style.backgroundColor = 'transparent';
        navbar.querySelectorAll('.nav-link, .navbar-brand span').forEach(el => el.style.color = '#ffffff');
    } else if (isDark) {
        navbar.style.backgroundColor = 'rgba(30, 30, 30, 0.95)';
        navbar.querySelectorAll('.nav-link, .navbar-brand span').forEach(el => el.style.color = 'var(--text-color)');
    } else {
        navbar.style.backgroundColor = 'var(--primary-color)';
        navbar.querySelectorAll('.nav-link, .navbar-brand span').forEach(el => el.style.color = '#ffffff');
    }
}

// Quiz Logic
let answers = { q1: null, q2: null, q3: null, q4: null };

function selectOption(questionNum, score, element) {
    const questionBlock = element.parentElement;
    questionBlock.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    answers['q' + questionNum] = score;
    
    setTimeout(() => {
        if (questionNum < 4) {
            const nextQ = document.getElementById('q' + (questionNum + 1));
            nextQ.style.display = 'block';
            nextQ.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            showResult();
        }
    }, 300);
}

function showResult() {
    const totalScore = (answers.q1 || 0) + (answers.q2 || 0) + (answers.q3 || 0) + (answers.q4 || 0);
    let resultClass, resultTitle, resultText, recommendation;
    
    if (totalScore <= 3) {
        resultClass = 'result-low';
        resultTitle = currentLang === 'en' ? 'Low Risk' : 'Risiko Rendah';
        resultText = currentLang === 'en' ? 'Your symptoms appear to be mild.' : 'Gejala anda kelihatan ringan.';
        recommendation = 'Rest well and stay hydrated.';
    } else if (totalScore <= 7) {
        resultClass = 'result-medium';
        resultTitle = currentLang === 'en' ? 'Moderate Risk' : 'Risiko Sederhana';
        resultText = 'Seek medical attention soon.';
        recommendation = 'Visit within 24 hours.';
    } else {
        resultClass = 'result-high';
        resultTitle = 'High Risk';
        resultText = 'Immediate Attention Needed.';
        recommendation = 'Please visit emergency room.';
    }
    
    document.getElementById('result').innerHTML = `
        <div class="result-box ${resultClass} p-4 mt-4 rounded shadow">
            <h4>${resultTitle}</h4>
            <p>${resultText}</p>
            <p>${recommendation}</p>
        </div>
    `;
    document.getElementById('result').style.display = 'block';
    document.getElementById('resetBtn').style.display = 'inline-block';
    for (let i = 1; i <= 4; i++) document.getElementById('q' + i).style.display = 'none';
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

function resetQuiz() {
    answers = { q1: null, q2: null, q3: null, q4: null };
    document.getElementById('result').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('q1').style.display = 'block';
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
}

function scrollToTop(e) {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Form logic
function nextStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.progress-step').forEach(p => p.classList.remove('active'));
    document.getElementById('step-' + (step + 1)).classList.add('active');
    document.getElementById('step-' + (step + 1) + '-indicator').classList.add('active');
}

function prevStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.progress-step').forEach(p => p.classList.remove('active'));
    document.getElementById('step-' + (step - 1)).classList.add('active');
    document.getElementById('step-' + (step - 1) + '-indicator').classList.add('active');
}

function filterDoctors(category) {
    document.querySelectorAll('.doctor-card-wrapper').forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    document.querySelectorAll('.doctor-filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}
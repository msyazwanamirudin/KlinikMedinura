document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Animation
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 50 });
    }

    // 2. Initialize Theme & Language
    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('language') || 'en';
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeIcon').className = 'fas fa-sun';
    }
    
    updateLanguageUI(savedLang);
});

// --- Theme Toggle ---
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

// --- Navbar Scroll ---
window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollToTopBtn');
    if (window.scrollY > 200) btn.style.display = 'flex';
    else btn.style.display = 'none';
});

function scrollToTop(e) {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Language Logic ---
let currentLang = 'en';

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ms' : 'en';
    localStorage.setItem('language', currentLang);
    updateLanguageUI(currentLang);
}

function updateLanguageUI(lang) {
    currentLang = lang;
    const btnText = document.getElementById('langText');
    if(btnText) btnText.textContent = lang === 'en' ? 'BM' : 'EN';

    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                const icon = el.querySelector('i');
                if (icon) {
                    el.innerHTML = '';
                    el.appendChild(icon);
                    el.append(' ' + text);
                } else {
                    el.textContent = text;
                }
            }
        }
    });
}

// --- Quiz Logic ---
let quizAnswers = {};

function selectOption(qNum, value, el) {
    const parent = el.parentElement;
    parent.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');
    quizAnswers[`q${qNum}`] = value;
    
    setTimeout(() => {
        const nextQ = document.getElementById(`q${qNum + 1}`);
        if (nextQ) {
            parent.style.display = 'none';
            nextQ.style.display = 'block';
        } else {
            showResult();
        }
    }, 300);
}

function showResult() {
    const score = Object.values(quizAnswers).reduce((a, b) => a + b, 0);
    const resultDiv = document.getElementById('result');
    const resetBtn = document.getElementById('resetBtn');
    
    document.getElementById('q4').style.display = 'none';

    let msg = '', cls = '';
    if (score <= 3) {
        cls = 'alert-success';
        msg = '<strong>Low Risk:</strong> Rest well and hydrate.';
    } else if (score <= 7) {
        cls = 'alert-warning';
        msg = '<strong>Moderate Risk:</strong> Visit us soon.';
    } else {
        cls = 'alert-danger';
        msg = '<strong>High Risk:</strong> Seek immediate help.';
    }

    resultDiv.innerHTML = `<div class="alert ${cls}">${msg}</div>`;
    resultDiv.style.display = 'block';
    resetBtn.style.display = 'inline-block';
}

function resetQuiz() {
    quizAnswers = {};
    document.getElementById('result').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    for(let i=1; i<=4; i++) {
        const q = document.getElementById(`q${i}`);
        if(q) q.style.display = 'none';
    }
    document.getElementById('q1').style.display = 'block';
    document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
}

// --- Appointment Wizard ---
function nextStep(current) {
    document.getElementById(`step-${current}`).style.display = 'none';
    document.getElementById(`step-${current}-indicator`).classList.remove('active');
    document.getElementById(`step-${current+1}`).style.display = 'block';
    document.getElementById(`step-${current+1}-indicator`).classList.add('active');
}

function prevStep(current) {
    document.getElementById(`step-${current}`).style.display = 'none';
    document.getElementById(`step-${current}-indicator`).classList.remove('active');
    document.getElementById(`step-${current-1}`).style.display = 'block';
    document.getElementById(`step-${current-1}-indicator`).classList.add('active');
}

function submitAppointmentForm(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const dept = document.querySelector('input[name="department"]:checked')?.value || 'General';
    const time = document.querySelector('input[name="time"]:checked')?.value || 'Anytime';
    const text = `Hi, I'd like to book an appointment.\nName: ${name}\nService: ${dept}\nTime: ${time}`;
    window.open(`https://wa.me/60105120050?text=${encodeURIComponent(text)}`, '_blank');
}
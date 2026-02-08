// --- Initialize Animation Library (AOS) ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if AOS is loaded
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800, // Animation duration
            once: true,    // Whether animation should happen only once
            offset: 100    // Offset (in px) from the original trigger point
        });
    }

    // Initialize Theme and Language
    initThemeAndLang();
});

// --- Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollBtn = document.getElementById('scrollToTopBtn');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        if(scrollBtn) scrollBtn.style.display = 'flex';
    } else {
        navbar.classList.remove('scrolled');
        if(scrollBtn) scrollBtn.style.display = 'none';
    }
});

function scrollToTop(e) {
    if (e && e.preventDefault) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Theme & Language Logic ---
function initThemeAndLang() {
    // Theme
    const savedTheme = localStorage.getItem('theme');
    const icon = document.getElementById('themeIcon');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (icon) icon.className = 'fas fa-sun';
    }

    // Language
    const savedLang = localStorage.getItem('language') || 'en';
    updateLanguageUI(savedLang);
}

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
}

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
                // If element has icon, preserve it
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

// --- Quiz Logic (Optimized) ---
let quizAnswers = {};

function selectOption(qNum, value, el) {
    // Visual selection
    const parent = el.parentElement;
    parent.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');
    
    // Logic
    quizAnswers[`q${qNum}`] = value;
    
    setTimeout(() => {
        const nextQ = document.getElementById(`q${qNum + 1}`);
        if (nextQ) {
            // Hide current, show next (simple transition)
            parent.style.display = 'none';
            nextQ.style.display = 'block';
            // Animation class for new question
            nextQ.classList.add('fade-in'); 
        } else {
            showResult();
        }
    }, 400);
}

function showResult() {
    const score = Object.values(quizAnswers).reduce((a, b) => a + b, 0);
    const resultDiv = document.getElementById('result');
    const resetBtn = document.getElementById('resetBtn');
    
    // Hide last question
    document.getElementById('q4').style.display = 'none';

    let msg = '';
    let colorClass = '';

    if (score <= 3) {
        colorClass = 'alert-success';
        msg = '<strong>Low Risk:</strong> Rest well and hydrate. Monitor for 24h.';
    } else if (score <= 7) {
        colorClass = 'alert-warning';
        msg = '<strong>Moderate Risk:</strong> Please visit us for a check-up soon.';
    } else {
        colorClass = 'alert-danger';
        msg = '<strong>High Risk:</strong> Please seek immediate medical attention.';
    }

    resultDiv.innerHTML = `<div class="alert ${colorClass}">${msg}</div>`;
    resultDiv.style.display = 'block';
    resetBtn.style.display = 'inline-block';
}

function resetQuiz() {
    quizAnswers = {};
    document.getElementById('result').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    
    // Hide all questions, show first
    for(let i=1; i<=4; i++) {
        const q = document.getElementById(`q${i}`);
        if(q) q.style.display = 'none';
    }
    document.getElementById('q1').style.display = 'block';
    
    document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
}

// --- Appointment Form Wizard ---
function nextStep(current) {
    // Simple validation could go here
    document.getElementById(`step-${current}`).style.display = 'none';
    document.getElementById(`step-${current}-indicator`).classList.remove('active');
    
    const next = current + 1;
    document.getElementById(`step-${next}`).style.display = 'block';
    document.getElementById(`step-${next}-indicator`).classList.add('active');
}

function prevStep(current) {
    document.getElementById(`step-${current}`).style.display = 'none';
    document.getElementById(`step-${current}-indicator`).classList.remove('active');
    
    const prev = current - 1;
    document.getElementById(`step-${prev}`).style.display = 'block';
    document.getElementById(`step-${prev}-indicator`).classList.add('active');
}

function submitAppointmentForm(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const dept = document.querySelector('input[name="department"]:checked')?.value || 'General';
    const time = document.querySelector('input[name="time"]:checked')?.value || 'Anytime';
    
    const text = `Hi, I'd like to book an appointment.\nName: ${name}\nService: ${dept}\nTime: ${time}`;
    window.open(`https://wa.me/60105120050?text=${encodeURIComponent(text)}`, '_blank');
}
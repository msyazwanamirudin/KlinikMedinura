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
                    const icon = element.querySelector('i').cloneNode(true);
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
    currentLang = (currentLang === 'en') ? 'ms' : 'en';
    applyLanguage();
    localStorage.setItem('language', currentLang);
}

// Initialize on load
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
    
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero-section');
    function updateNavbarContrast() {
        if (!navbar || !hero) return;
        const heroRect = hero.getBoundingClientRect();
        const navHeight = navbar.offsetHeight || 60;
        const isOverHero = heroRect.bottom > navHeight;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isOverHero && !isDark) {
            navbar.classList.add('over-hero');
        } else {
            navbar.classList.remove('over-hero');
        }
    }

    updateNavbarContrast();
    window.addEventListener('scroll', updateNavbarContrast);
    window.addEventListener('resize', updateNavbarContrast);
});

// === FEVER SYMPTOM CHECKER LOGIC ===
let answers = { q1: null, q2: null, q3: null, q4: null };

function selectOption(questionNum, score, element) {
    const questionBlock = element.parentElement;
    questionBlock.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
        opt.classList.remove('is-invalid', 'shake');
    });
    
    element.classList.add('selected');
    answers['q' + questionNum] = score;
    
    setTimeout(() => {
        if (questionNum < 4) {
            document.getElementById('q' + (questionNum + 1)).style.display = 'block';
            document.getElementById('q' + (questionNum + 1)).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            if (validateQuiz()) {
                showResult();
            }
        }
    }, 300);
}

function validateQuiz() {
    for (let i = 1; i <= 4; i++) {
        if (answers['q' + i] === null) {
            const quizAlert = currentLang === 'en' 
                ? `Please answer question ${i} before proceeding.` 
                : `Sila jawab soalan ${i} sebelum meneruskan.`;
            alert(quizAlert);
            const qBlock = document.getElementById('q' + i);
            qBlock.classList.add('shake');
            qBlock.style.display = 'block';
            qBlock.scrollIntoView({ behavior: 'smooth' });
            return false;
        }
    }
    return true;
}

function showResult() {
    if (!validateQuiz()) return;

    const totalScore = answers.q1 + answers.q2 + answers.q3 + answers.q4;
    let resultClass, resultTitle, resultText, recommendation;
    
    if (totalScore <= 3) {
        resultClass = 'result-low';
        resultTitle = currentLang === 'en' ? 'Low Risk' : 'Risiko Rendah';
        resultText = currentLang === 'en' ? 'Your symptoms appear to be mild.' : 'Gejala anda kelihatan ringan.';
        recommendation = currentLang === 'en' ? 'Rest well and stay hydrated.' : 'Rehat dengan baik dan kekal hidrasi.';
    } else if (totalScore <= 7) {
        resultClass = 'result-medium';
        resultTitle = currentLang === 'en' ? 'Moderate Risk' : 'Risiko Sederhana';
        resultText = currentLang === 'en' ? 'Seek medical attention soon.' : 'Dapatkan rawatan perubatan segera.';
        recommendation = currentLang === 'en' ? 'Visit our clinic within 24 hours.' : 'Lawat klinik kami dalam masa 24 jam.';
    } else {
        resultClass = 'result-high';
        resultTitle = currentLang === 'en' ? 'High Risk' : 'Risiko Tinggi';
        resultText = currentLang === 'en' ? 'Immediate attention needed!' : 'Perhatian segera diperlukan!';
        recommendation = currentLang === 'en' ? 'Visit our clinic or ER immediately.' : 'Lawat klinik atau kecemasan segera.';
    }
    
    const resultHTML = `
        <div class="result-box ${resultClass}">
            <h4>${resultTitle}</h4>
            <p><strong>${resultText}</strong></p>
            <p>${recommendation}</p>
            <button onclick=\"window.open('https://wa.me/60172032048', '_blank')\" class=\"btn btn-whatsapp mt-2\">
                ${currentLang === 'en' ? 'Book Appointment' : 'Tempah Janji Temu'}
            </button>
        </div>
    `;
    
    document.getElementById('result').innerHTML = resultHTML;
    document.getElementById('result').style.display = 'block';
    document.getElementById('resetBtn').style.display = 'inline-block';
    for (let i = 1; i <= 4; i++) { document.getElementById('q' + i).style.display = 'none'; }
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

function resetQuiz() {
    answers = { q1: null, q2: null, q3: null, q4: null };
    document.getElementById('result').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('q1').style.display = 'block';
    for (let i = 2; i <= 4; i++) { document.getElementById('q' + i).style.display = 'none'; }
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected', 'is-invalid', 'shake'));
    document.getElementById('health-checker').scrollIntoView({ behavior: 'smooth' });
}

// === APPOINTMENT FORM VALIDATION & WHATSAPP AUTOFILL ===
function submitAppointmentForm(e) {
    if (e) e.preventDefault();

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    
    // Clear previous error states
    nameInput?.classList.remove('is-invalid', 'shake');
    phoneInput?.classList.remove('is-invalid', 'shake');

    const name = nameInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    
    let isValid = true;

    if (name === '') {
        nameInput?.classList.add('is-invalid', 'shake');
        isValid = false;
    }
    if (phone === '') {
        phoneInput?.classList.add('is-invalid', 'shake');
        isValid = false;
    }

    if (!isValid) {
        const alertMsg = currentLang === 'en' 
            ? 'Please provide at least your name and phone number.' 
            : 'Sila berikan sekurang-kurangnya nama dan nombor telefon anda.';
        alert(alertMsg);
        return;
    }

    const deptEl = document.querySelector('input[name="department"]:checked');
    const timeEl = document.querySelector('input[name="time"]:checked');
    
    if (!deptEl || !timeEl) {
        const alertMsg = currentLang === 'en' 
            ? 'Please select a department and a preferred time.' 
            : 'Sila pilih jabatan dan waktu pilihan.';
        alert(alertMsg);
        return;
    }

    const dept = deptEl.value;
    const time = timeEl.value;
    const notes = document.getElementById('notes')?.value || 'None';
    
    const message = `Hello Klinik Medinura! I would like to book an appointment.
*Name:* ${name}
*Department:* ${dept}
*Preferred Time:* ${time}
*Phone:* ${phone}
*Notes:* ${notes}`;
    
    const whatsappUrl = `https://wa.me/60172032048?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// === FORM NAVIGATION ===
function nextStep(stepNum) {
    if (stepNum === 1) {
        if (document.querySelector('input[name="department"]:checked')) moveToStep(2);
        else alert(currentLang === 'en' ? 'Please select a department.' : 'Sila pilih jabatan.');
    } else if (stepNum === 2) {
        if (document.querySelector('input[name="time"]:checked')) moveToStep(3);
        else alert(currentLang === 'en' ? 'Please select a time.' : 'Sila pilih waktu.');
    }
}

function prevStep(stepNum) { moveToStep(stepNum - 1); }

function moveToStep(step) {
    for (let i = 1; i <= 3; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        const indicatorEl = document.getElementById(`step-${i}-indicator`);
        if (stepEl) stepEl.classList.remove('active');
        if (indicatorEl) indicatorEl.classList.remove('active');
    }
    const currentStepEl = document.getElementById(`step-${step}`);
    const currentIndicatorEl = document.getElementById(`step-${step}-indicator`);
    if (currentStepEl) currentStepEl.classList.add('active');
    if (currentIndicatorEl) currentIndicatorEl.classList.add('active');
}

// === UI HELPERS ===
function scrollToTop(e) {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterDoctors(category) {
    const doctors = document.querySelectorAll('.doctor-card-wrapper');
    const buttons = document.querySelectorAll('.doctor-filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    doctors.forEach(doctor => {
        doctor.style.display = (category === 'all' || doctor.getAttribute('data-category') === category) ? 'block' : 'none';
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return;
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 50 });
    }

    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('language') || 'en';
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeIcon').className = 'fas fa-sun';
        const mobileIcon = document.getElementById('themeIconMobile');
        if(mobileIcon) mobileIcon.className = 'fas fa-sun';
    }
    updateLanguageUI(savedLang);
    initScrollSpy();
    shuffleQuiz(); // Shuffle on load
});

// --- Theme Logic ---
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    const mobileIcon = document.getElementById('themeIconMobile');
    
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        icon.className = 'fas fa-moon';
        if(mobileIcon) mobileIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
        if(mobileIcon) mobileIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
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
    const btn = document.getElementById('langBtn');
    const mobileBtn = document.getElementById('langBtnMobile');
    if(btn) btn.textContent = lang === 'en' ? 'BM' : 'EN';
    if(mobileBtn) mobileBtn.textContent = lang === 'en' ? 'BM' : 'EN';

    // 1. Update Standard Text
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            // Check if element is an Input or Textarea (skip here, handled below)
            if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
                const icon = el.querySelector('i');
                if (icon) {
                    // Preserve Icon if it exists
                    const safeText = text; 
                    el.innerHTML = '';
                    el.appendChild(icon);
                    el.append(' ' + safeText);
                } else {
                    el.textContent = text;
                }
            }
        }
    });

    // 2. Update Placeholders (Fix for Appointment Form)
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        const ph = el.getAttribute(`data-${lang}-placeholder`);
        if(ph) el.placeholder = ph;
    });
}

// --- Scroll & Nav Logic ---
function initScrollSpy() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-bottom-nav .nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    const navbar = document.querySelector('.navbar');
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (window.scrollY > 50) navbar.classList.add('shadow-sm');
    else navbar.classList.remove('shadow-sm');

    if (window.scrollY > 300) scrollBtn.style.display = 'flex';
    else scrollBtn.style.display = 'none';
}

function scrollToTop(e) {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Doctor Filter ---
function filterDoctors(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.doctor-item');

    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(category)) btn.classList.add('active');
    });

    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        card.classList.remove('aos-animate');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => card.classList.add('aos-animate'), 50);
        } else {
            card.style.display = 'none';
        }
    });
    setTimeout(() => { if(typeof AOS !== 'undefined') AOS.refresh(); }, 100);
}

// --- Quiz Logic (FIXED STYLE & INFINITE LOOP & RANDOM) ---
let quizData = { q1: 0, q2: 0, q3: 0 };

function shuffleQuiz() {
    const containers = document.querySelectorAll('.option-group');
    containers.forEach(container => {
        for (let i = container.children.length; i >= 0; i--) {
            container.appendChild(container.children[Math.random() * i | 0]);
        }
    });
}

function selectOption(qNum, val) {
    quizData['q'+qNum] = val;
    
    // Hide current using Class
    const currentStep = document.getElementById(`q${qNum}`);
    currentStep.classList.remove('active'); 
    
    if (qNum < 3) {
        const next = document.getElementById(`q${qNum + 1}`);
        next.classList.add('active');
    } else {
        showResult();
    }
}

function showResult() {
    const total = quizData.q1 + quizData.q2 + quizData.q3;
    const resDiv = document.getElementById('result');
    const title = resDiv.querySelector('.result-title');
    const desc = resDiv.querySelector('.result-desc');
    
    // Get current language
    const lang = localStorage.getItem('language') || 'en';

    // Translation Dictionary
    const texts = {
        low: {
            en: { title: "Low Risk", desc: "Mild condition. Rest well." },
            ms: { title: "Risiko Rendah", desc: "Keadaan ringan. Berehat secukupnya." }
        },
        moderate: {
            en: { title: "Moderate Risk", desc: "Monitor closely." },
            ms: { title: "Risiko Sederhana", desc: "Pantau dengan teliti." }
        },
        high: {
            en: { title: "High Risk", desc: "Visit clinic immediately." },
            ms: { title: "Risiko Tinggi", desc: "Sila ke klinik dengan segera." }
        }
    };

    document.getElementById('result').style.display = 'block';

    let resultKey = '';

    if (total <= 2) {
        resultKey = 'low';
        title.className = "result-title text-success";
    } else if (total <= 5) {
        resultKey = 'moderate';
        title.className = "result-title text-warning";
    } else {
        resultKey = 'high';
        title.className = "result-title text-danger";
    }

    // Apply Translated Text
    title.innerText = texts[resultKey][lang].title;
    desc.innerText = texts[resultKey][lang].desc;
}

function resetQuiz() {
    document.getElementById('result').style.display = 'none';
    
    document.getElementById('q1').classList.remove('active');
    document.getElementById('q2').classList.remove('active');
    document.getElementById('q3').classList.remove('active');
    
    shuffleQuiz(); // Re-shuffle on reset

    // Trigger Reflow to restart animation
    void document.getElementById('q1').offsetWidth; 
    document.getElementById('q1').classList.add('active');
    
    quizData = { q1: 0, q2: 0, q3: 0 };
}

// --- Appointment Wizard ---
function autoNextStep(step, val) {
    document.getElementById('selectedService').value = val;
    nextStep(step);
}

function nextStep(current) {
    let isValid = false;
    let currentContainer = document.getElementById(`step-${current}`);
    const alertBox = document.getElementById(`alert-${current}`);
    if(alertBox) alertBox.style.display = 'none';
    removeErrors(currentContainer);

    if (current === 1) {
        if (document.getElementById('selectedService').value !== '') isValid = true;
        else {
            if(alertBox) alertBox.style.display = 'block';
            const options = currentContainer.querySelectorAll('.quiz-btn');
            options.forEach(opt => opt.classList.add('input-error'));
            setTimeout(() => removeErrors(currentContainer), 500);
        }
    } else if (current === 2) {
        const d = document.getElementById('apptDate').value;
        const t = document.getElementById('apptTime').value;
        if (d && t) isValid = true;
        else {
            if(alertBox) alertBox.style.display = 'block';
            const options = currentContainer.querySelectorAll('.form-control');
            options.forEach(opt => opt.classList.add('input-error'));
            setTimeout(() => removeErrors(currentContainer), 500);
        }
    }

    if (isValid) {
        document.getElementById(`step-${current}`).classList.remove('active');
        document.getElementById(`step-${current+1}`).classList.add('active');
    }
}

function prevStep(current) {
    document.getElementById(`step-${current}`).classList.remove('active');
    document.getElementById(`step-${current-1}`).classList.add('active');
}

function submitAppointment(e) {
    e.preventDefault();
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    let isValid = true;
    nameInput.classList.remove('input-error');
    phoneInput.classList.remove('input-error');

    if (!nameInput.value.trim()) { nameInput.classList.add('input-error'); isValid = false; }
    if (!phoneInput.value.trim()) { phoneInput.classList.add('input-error'); isValid = false; }

    if (isValid) {
        const service = document.getElementById('selectedService').value;
        const date = document.getElementById('apptDate').value;
        const time = document.getElementById('apptTime').value;
        const text = `Hello Klinik Medinura!%0AI would like to book an appointment.%0A%0A👤 *Name:* ${nameInput.value}%0A📞 *Phone:* ${phoneInput.value}%0A🏥 *Service:* ${service}%0A📅 *Date:* ${date}%0A🕒 *Time:* ${time}`;
        window.open(`https://wa.me/60105120050?text=${text}`, '_blank');
    } else {
        setTimeout(() => {
            nameInput.classList.remove('input-error');
            phoneInput.classList.remove('input-error');
        }, 500);
    }
}

function removeErrors(container) {
    container.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

/* =========================================
   6. CONTENT PROTECTION (Speedbump)
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Create the Alert Bubble Dynamically
    const alertBox = document.createElement('div');
    alertBox.id = 'protection-alert';
    // Using a lock icon and simple text
    alertBox.innerHTML = '<i class="fas fa-lock"></i> <span>Content is protected</span>';
    document.body.appendChild(alertBox);

    // 2. Logic to Show/Hide Alert
    let timeout;
    function showProtectionAlert() {
        alertBox.classList.add('show');
        
        // Reset timer if triggered multiple times
        clearTimeout(timeout);
        
        // Hide after 2 seconds
        timeout = setTimeout(() => {
            alertBox.classList.remove('show');
        }, 2000);
    }

    // 3. Disable Right Click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showProtectionAlert();
    });

    // 4. Disable Keyboard Shortcuts (Copy, Save, Inspect)
    document.addEventListener('keydown', (e) => {
        // F12 (Dev Tools)
        if (e.key === 'F12') {
            e.preventDefault();
            showProtectionAlert();
        }
        
        // Ctrl+Shift+I (Inspect) or Ctrl+Shift+J (Console) or Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
            e.preventDefault();
            showProtectionAlert();
        }

        // Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            showProtectionAlert();
        }

        // Ctrl+S (Save Page)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            showProtectionAlert();
        }
    });
});
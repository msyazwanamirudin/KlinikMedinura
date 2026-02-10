document.addEventListener('DOMContentLoaded', () => {
    // 1. Init Animation
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 50 });
    }

    // 2. Init Theme & Lang
    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('language') || 'en';
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeIcon').className = 'fas fa-sun';
    }
    updateLanguageUI(savedLang);

    // 3. Init ScrollSpy (THIS FIXES THE NAV PILL)
    initScrollSpy();
});

// --- ScrollSpy Logic ---
function initScrollSpy() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // 100px offset to trigger highlight slightly before the section hits top
            if (window.scrollY >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if link href matches the current section ID
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// --- Scroll & Navbar Styles ---
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollBtn = document.getElementById('scrollToTopBtn');
    
    if (window.scrollY > 50) navbar.classList.add('shadow-sm');
    else navbar.classList.remove('shadow-sm');

    if (window.scrollY > 300) scrollBtn.style.display = 'flex';
    else scrollBtn.style.display = 'none';
});

function scrollToTop(e) {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
    if(btn) btn.textContent = lang === 'en' ? 'BM' : 'EN';

    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.textContent = text;
    });
}

// --- Quiz Logic ---
let quizData = { q1: 0, q2: 0, q3: 0 };

function selectOption(qNum, val, btn) {
    quizData[`q${qNum}`] = val;
    const currentStep = document.getElementById(`q${qNum}`);
    
    currentStep.style.display = 'none';
    
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
    const icon = resDiv.querySelector('.result-icon');

    resDiv.style.display = 'block';

    if (total <= 2) {
        title.innerText = "Low Risk";
        title.className = "result-title text-success";
        desc.innerText = "It seems like a mild condition. Rest well and hydrate.";
        icon.innerHTML = '<i class="fas fa-smile text-success fa-3x"></i>';
    } else if (total <= 5) {
        title.innerText = "Moderate Risk";
        title.className = "result-title text-warning";
        desc.innerText = "Monitor your symptoms closely. If they persist, visit us.";
        icon.innerHTML = '<i class="fas fa-meh text-warning fa-3x"></i>';
    } else {
        title.innerText = "High Risk";
        title.className = "result-title text-danger";
        desc.innerText = "Please visit the clinic immediately for a check-up.";
        icon.innerHTML = '<i class="fas fa-frown text-danger fa-3x"></i>';
    }
}

function resetQuiz() {
    document.getElementById('result').style.display = 'none';
    document.getElementById('q1').classList.add('active');
}

// ... (Keep your AOS, Theme, Navbar, Language, and Quiz logic above this) ...

// --- Appointment Wizard with Validation ---

function nextStep(current) {
    let isValid = false;
    let currentContainer = document.getElementById(`step-${current}`);

    // Remove previous error styles
    removeErrors(currentContainer);

    // Validate Step 1: Service Selection
    if (current === 1) {
        const service = document.querySelector('input[name="service"]:checked');
        if (service) {
            isValid = true;
        } else {
            // Shake the options container if nothing selected
            const options = currentContainer.querySelectorAll('.select-box .content');
            options.forEach(opt => opt.classList.add('input-error'));
            setTimeout(() => removeErrors(currentContainer), 500); // Remove class after animation
        }
    } 
    // Validate Step 2: Time Selection
    else if (current === 2) {
        const time = document.querySelector('input[name="time"]:checked');
        if (time) {
            isValid = true;
        } else {
            const options = currentContainer.querySelectorAll('.time-pill span');
            options.forEach(opt => opt.classList.add('input-error'));
            setTimeout(() => removeErrors(currentContainer), 500);
        }
    }

    // Only proceed if valid
    if (isValid) {
        document.getElementById(`step-${current}`).classList.remove('active');
        document.getElementById(`step-${current+1}`).classList.add('active');
        
        // Update progress bar
        document.getElementById(`p${current}`).classList.remove('active');
        document.getElementById(`p${current}`).classList.add('completed');
        document.getElementById(`p${current+1}`).classList.add('active');
    }
}

function prevStep(current) {
    document.getElementById(`step-${current}`).classList.remove('active');
    document.getElementById(`step-${current-1}`).classList.add('active');
    
    document.getElementById(`p${current}`).classList.remove('active');
    document.getElementById(`p${current-1}`).classList.add('active');
}

function submitAppointment(e) {
    e.preventDefault();
    
    // Validate Inputs
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    let isValid = true;

    // Reset styles
    nameInput.classList.remove('input-error');
    phoneInput.classList.remove('input-error');

    if (!nameInput.value.trim()) {
        nameInput.classList.add('input-error');
        isValid = false;
    }
    if (!phoneInput.value.trim()) {
        phoneInput.classList.add('input-error');
        isValid = false;
    }

    if (isValid) {
        const service = document.querySelector('input[name="service"]:checked')?.value;
        const time = document.querySelector('input[name="time"]:checked')?.value;
        const name = nameInput.value;
        const phone = phoneInput.value;
        
        // Format for WhatsApp (URL Encoded)
        const text = `Hello Klinik Medinura!%0AI would like to book an appointment.%0A%0A👤 *Name:* ${name}%0A📞 *Phone:* ${phone}%0A🏥 *Service:* ${service}%0A🕒 *Time:* ${time}`;
        
        window.open(`https://wa.me/60105120050?text=${text}`, '_blank');
    } else {
        // Remove error class after animation
        setTimeout(() => {
            nameInput.classList.remove('input-error');
            phoneInput.classList.remove('input-error');
        }, 500);
    }
}

// Helper to clean up error classes
function removeErrors(container) {
    container.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}
// --- Doctor Filter Logic ---
function filterDoctors(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.doctor-item');

    // 1. Update Buttons
    buttons.forEach(btn => {
        // Remove active class from all
        btn.classList.remove('active');
        // Add active to the clicked button (checking attributes to match language support)
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        }
    });

    // 2. Filter Cards
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Reset animation for re-triggering
        card.classList.remove('aos-animate');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            // Small timeout to allow display:block to apply before animating opacity
            setTimeout(() => card.classList.add('aos-animate'), 50);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Refresh AOS layout since heights might change
    setTimeout(() => {
        if(typeof AOS !== 'undefined') AOS.refresh();
    }, 100);
}


document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 50 });
    }

    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('language') || 'en';
    
    // Initial Load Logic (kept minimal just to apply saved state if any, but no toggles)
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateLanguageUI(savedLang);
    initScrollSpy();
    
    // --- Content Protection ---
    const alertBox = document.createElement('div');
    alertBox.id = 'protection-alert';
    alertBox.innerHTML = '<i class="fas fa-lock"></i> <span>Content is protected</span>';
    document.body.appendChild(alertBox);

    let timeout;
    function showProtectionAlert() {
        alertBox.classList.add('show');
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            alertBox.classList.remove('show');
        }, 2000);
    }

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showProtectionAlert();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
            (e.ctrlKey && e.key === 'u') || 
            (e.ctrlKey && e.key === 's')) {
            e.preventDefault();
            showProtectionAlert();
        }
    });
});

// --- Language Logic (Internal Only - No Toggles) ---
let currentLang = 'en';

function updateLanguageUI(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                const ph = el.getAttribute(`data-${lang}-placeholder`);
                if(ph) el.placeholder = ph;
            } else {
                const icon = el.querySelector('i');
                if (icon) {
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
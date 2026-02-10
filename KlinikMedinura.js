// ... (previous logic for initScrollSpy, ToggleTheme etc. remains same) ...

document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 50 });
    }

    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('language') || 'en';
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeIcon').className = 'fas fa-sun';
    }
    updateLanguageUI(savedLang);
    initScrollSpy();
});

// ... (ToggleTheme, ToggleLanguage, ScrollSpy functions same as before) ...

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
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                const ph = el.getAttribute(`data-${lang}-placeholder`);
                if(ph) el.placeholder = ph;
            } else {
                // Preserve icons if present
                const icon = el.querySelector('i');
                if (icon) {
                    // if wrapper span exists, update text inside it
                    // simpler: re-render icon + text
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

// ... (Quiz Logic Same as before) ...

// --- Appointment Wizard with Validation Alert ---

function nextStep(current) {
    let isValid = false;
    let currentContainer = document.getElementById(`step-${current}`);
    
    // Hide Alert initially
    const alertBox = document.getElementById(`alert-${current}`);
    if(alertBox) alertBox.style.display = 'none';

    // Remove red borders
    removeErrors(currentContainer);

    // Validate Step 1: Service Selection
    if (current === 1) {
        if (document.querySelector('input[name="service"]:checked')) {
            isValid = true;
        } else {
            // SHOW ALERT
            if(alertBox) alertBox.style.display = 'block';
            
            // Shake options
            const options = currentContainer.querySelectorAll('.select-box .content');
            options.forEach(opt => opt.classList.add('input-error'));
            setTimeout(() => removeErrors(currentContainer), 500);
        }
    } 
    // Validate Step 2: Time Selection
    else if (current === 2) {
        if (document.querySelector('input[name="time"]:checked')) {
            isValid = true;
        } else {
            // SHOW ALERT
            if(alertBox) alertBox.style.display = 'block';

            const options = currentContainer.querySelectorAll('.time-pill span');
            options.forEach(opt => opt.classList.add('input-error'));
            setTimeout(() => removeErrors(currentContainer), 500);
        }
    }

    if (isValid) {
        document.getElementById(`step-${current}`).classList.remove('active');
        document.getElementById(`step-${current+1}`).classList.add('active');
        
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
    
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    let isValid = true;

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
        
        const text = `Hello Klinik Medinura!%0AI would like to book an appointment.%0A%0A👤 *Name:* ${name}%0A📞 *Phone:* ${phone}%0A🏥 *Service:* ${service}%0A🕒 *Time:* ${time}`;
        
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

// ... (Filter Doctors Logic & ScrollSpy same as before) ...
function initScrollSpy() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');

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
}

function filterDoctors(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.doctor-item');

    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        }
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
    
    setTimeout(() => {
        if(typeof AOS !== 'undefined') AOS.refresh();
    }, 100);
}

// Quiz Logic
let quizData2 = { q1: 0, q2: 0, q3: 0 }; // Renamed to avoid conflicts if any

function selectOption(qNum, val, btn) {
    quizData2[`q${qNum}`] = val;
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
    const total = quizData2.q1 + quizData2.q2 + quizData2.q3;
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
    document.getElementById('q1').style.display = 'block';
    document.getElementById('q1').classList.add('active');
    // Hide others
    document.getElementById('q2').style.display = 'none';
    document.getElementById('q3').style.display = 'none';
}
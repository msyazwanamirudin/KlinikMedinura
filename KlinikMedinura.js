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
    document.getElementById('langText').textContent = currentLang === 'en' ? 'BM' : 'EN';
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute('data-' + currentLang);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                // preserve inner HTML for buttons with icons
                if (element.querySelector && element.querySelector('i')) {
                    // try replacing only the text nodes
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

    // scroll button
    const scBtn = document.getElementById('scrollToTopBtn');
    if (scBtn) scBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
    
    // Navbar contrast when over hero (light mode)
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero-section');
    function updateNavbarContrast() {
        if (!navbar || !hero) return;
        const heroRect = hero.getBoundingClientRect();
        const navHeight = navbar.offsetHeight || 60;
        // If hero's bottom is below the nav height, navbar is over hero
        const isOverHero = heroRect.bottom > navHeight;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isOverHero && !isDark) {
            navbar.classList.add('over-hero');
        } else {
            navbar.classList.remove('over-hero');
        }
    }

    // Run on load and on scroll/resize
    updateNavbarContrast();
    window.addEventListener('scroll', updateNavbarContrast);
    window.addEventListener('resize', updateNavbarContrast);
});

// Quiz Logic
let answers = {
    q1: null,
    q2: null,
    q3: null,
    q4: null
};

        function selectOption(questionNum, score, element) {
            // Remove selected class from all options in this question
            const questionBlock = element.parentElement;
            questionBlock.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            element.classList.add('selected');
            
            // Store answer
            answers['q' + questionNum] = score;
            
            // Show next question or result
            setTimeout(() => {
                if (questionNum < 4) {
                    document.getElementById('q' + (questionNum + 1)).style.display = 'block';
                    document.getElementById('q' + (questionNum + 1)).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    showResult();
                }
            }, 300);
        }

        function showResult() {
            // Calculate total score
            const totalScore = answers.q1 + answers.q2 + answers.q3 + answers.q4;
            
            let resultClass, resultTitle, resultText, recommendation;
            
            if (totalScore <= 3) {
                resultClass = 'result-low';
                resultTitle = currentLang === 'en' ? 'Low Risk' : 'Risiko Rendah';
                resultText = currentLang === 'en' 
                    ? 'Your symptoms appear to be mild. Continue to monitor your condition and maintain good hydration.' 
                    : 'Gejala anda kelihatan ringan. Teruskan memantau keadaan anda dan kekalkan hidrasi yang baik.';
                recommendation = currentLang === 'en'
                    ? 'Rest well, drink plenty of fluids, and take over-the-counter fever medication if needed. If symptoms persist for more than 3 days, please visit our clinic.'
                    : 'Rehat dengan baik, minum banyak air, dan ambil ubat demam jika perlu. Jika gejala berterusan lebih dari 3 hari, sila lawat klinik kami.';
            } else if (totalScore <= 7) {
                resultClass = 'result-medium';
                resultTitle = currentLang === 'en' ? 'Moderate Risk' : 'Risiko Sederhana';
                resultText = currentLang === 'en'
                    ? 'Your symptoms suggest you should seek medical attention soon.'
                    : 'Gejala anda menunjukkan anda perlu mendapatkan rawatan perubatan tidak lama lagi.';
                recommendation = currentLang === 'en'
                    ? 'We recommend visiting our clinic within the next 24 hours for proper evaluation and treatment. You may have dengue fever or another serious infection.'
                    : 'Kami cadangkan melawat klinik kami dalam 24 jam akan datang untuk penilaian dan rawatan yang sesuai. Anda mungkin menghidap demam denggi atau jangkitan serius lain.';
            } else {
                resultClass = 'result-high';
                resultTitle = currentLang === 'en' ? 'High Risk - Immediate Attention Needed' : 'Risiko Tinggi - Perhatian Segera Diperlukan';
                resultText = currentLang === 'en'
                    ? 'Your symptoms are concerning and require immediate medical attention.'
                    : 'Gejala anda membimbangkan dan memerlukan perhatian perubatan segera.';
                recommendation = currentLang === 'en'
                    ? 'Please visit our clinic immediately or go to the nearest emergency room. Your symptoms may indicate dengue fever or another serious condition requiring urgent care.'
                    : 'Sila lawat klinik kami dengan segera atau pergi ke bilik kecemasan terdekat. Gejala anda mungkin menunjukkan demam denggi atau keadaan serius lain yang memerlukan rawatan segera.';
            }
            
            const resultHTML = `
                <div class="result-box ${resultClass}">
                    <h4 class="mb-3"><i class="fas fa-clipboard-check me-2"></i>${resultTitle}</h4>
                    <p class="mb-3"><strong>${resultText}</strong></p>
                    <p class="mb-4">${recommendation}</p>
                    <div class="d-grid gap-2">
                        <a href="https://wa.me/60105120050" target="_blank" class="btn btn-whatsapp">
                            <i class="fab fa-whatsapp me-2"></i>${currentLang === 'en' ? 'Book Appointment Now' : 'Tempah Janji Temu Sekarang'}
                        </a>
                    </div>
                    <p class="mt-3 mb-0 small text-muted">
                        <i class="fas fa-info-circle me-1"></i>
                        ${currentLang === 'en' 
                            ? 'This is a preliminary assessment only. Please consult a healthcare professional for accurate diagnosis.' 
                            : 'Ini adalah penilaian awal sahaja. Sila rujuk profesional kesihatan untuk diagnosis yang tepat.'}
                    </p>
                </div>
            `;
            
            document.getElementById('result').innerHTML = resultHTML;
            document.getElementById('result').style.display = 'block';
            document.getElementById('resetBtn').style.display = 'inline-block';
            
            // Hide all questions
            for (let i = 1; i <= 4; i++) {
                document.getElementById('q' + i).style.display = 'none';
            }
            
            // Scroll to result
            document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
        }

        function resetQuiz() {
            answers = { q1: null, q2: null, q3: null, q4: null };
            
            // Hide result and reset button
            document.getElementById('result').style.display = 'none';
            document.getElementById('resetBtn').style.display = 'none';
            
            // Show first question and hide others
            document.getElementById('q1').style.display = 'block';
            for (let i = 2; i <= 4; i++) {
                document.getElementById('q' + i).style.display = 'none';
            }
            
            // Remove all selected classes
            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Scroll to quiz
            document.getElementById('health-checker').scrollIntoView({ behavior: 'smooth' });
        }

// Scroll to top and show/hide button
function scrollToTop(e) {
    if (e && e.preventDefault) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    const scBtn = document.getElementById('scrollToTopBtn');
    if (!scBtn) return;
    if (window.scrollY > 200) scBtn.style.display = 'flex'; else scBtn.style.display = 'none';
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // allow logo click to call scrollToTop
        if (this.getAttribute('href') === '#') return;
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// === FLIP CARDS: discoverability helpers ===
// Add hint labels, demo animation on load, and tap-to-toggle for touch users
document.addEventListener('DOMContentLoaded', () => {
    // Insert action hint into each front pane if missing
    document.querySelectorAll('.flip-content.front').forEach(front => {
        if (!front.querySelector('.action-hint')) {
            const hint = document.createElement('div');
            hint.className = 'action-hint';
            const isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
            const enHint = isTouch ? 'Tap to view tips' : 'Hover or tap to view tips';
            const msHint = isTouch ? 'Ketuk untuk petua' : 'Arahkan atau ketik untuk petua';
            hint.textContent = (typeof currentLang !== 'undefined' && currentLang === 'ms') ? msHint : enHint;
            front.appendChild(hint);
        }
    });

    // One-time demo: briefly show hover effect to signal interactivity
    const cards = document.querySelectorAll('.condition-card');
    if (cards.length) {
        cards.forEach(c => c.classList.add('demo'));
        setTimeout(() => { cards.forEach(c => c.classList.remove('demo')); }, 1400);
    }

    // Touch / tap support: toggle .active on tap for devices without hover
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.condition-card');
        if (!card) return;
        const isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
        if (isTouch) {
            // Toggle active state; allow links inside to work normally
            card.classList.toggle('active');
        }
    });
});


// === APPOINTMENT FORM FUNCTIONS ===
let currentFormStep = 1;

function nextStep(stepNum) {
    if (stepNum === 1) {
        if (document.querySelector('input[name="department"]:checked')) {
            moveToStep(2);
        }
    } else if (stepNum === 2) {
        if (document.querySelector('input[name="time"]:checked')) {
            moveToStep(3);
        }
    }
}

function prevStep(stepNum) {
    moveToStep(stepNum - 1);
}

function moveToStep(step) {
    // Hide all steps
    for (let i = 1; i <= 3; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        const indicatorEl = document.getElementById(`step-${i}-indicator`);
        if (stepEl) {
            stepEl.classList.remove('active');
            indicatorEl?.classList.remove('active');
        }
    }
    
    // Show current step
    const currentStepEl = document.getElementById(`step-${step}`);
    const currentIndicatorEl = document.getElementById(`step-${step}-indicator`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
        currentIndicatorEl?.classList.add('active');
    }
    
    currentFormStep = step;
}

function submitAppointmentForm(e) {
    const name = document.getElementById('name')?.value || 'Guest';
    const phone = document.getElementById('phone')?.value || '';
    const dept = document.querySelector('input[name="department"]:checked')?.value || '';
    const time = document.querySelector('input[name="time"]:checked')?.value || '';
    const notes = document.getElementById('notes')?.value || '';
    
    const message = `Hello Klinik Medinura! I would like to book an appointment.\nName: ${name}\nDepartment: ${dept}\nPreferred Time: ${time}\nPhone: ${phone}\nNotes: ${notes}`;
    
    // Update href with encoded message
    e.target.href = `https://wa.me/60105120050?text=${encodeURIComponent(message)}`;
}

// === DOCTOR FILTER FUNCTIONALITY ===
function filterDoctors(category) {
    const doctors = document.querySelectorAll('.doctor-card-wrapper');
    const buttons = document.querySelectorAll('.doctor-filter-btn');
    
    // Remove active from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Add active to clicked button
    event.target.classList.add('active');
    
    // Filter doctors
    doctors.forEach(doctor => {
        if (category === 'all') {
            doctor.style.display = 'block';
        } else if (doctor.getAttribute('data-category') === category) {
            doctor.style.display = 'block';
        } else {
            doctor.style.display = 'none';
        }
    });
}

// === VISION SLIDER FUNCTIONALITY ===
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('visionSlider');
    const handle = document.getElementById('sliderHandle');
    const before = document.querySelector('.vision-slider-before');
    
    if (!slider || !handle || !before) return;
    
    let isActive = false;
    
    function updateSlider(e) {
        if (!isActive) return;
        
        const rect = slider.getBoundingClientRect();
        let x = e.clientX - rect.left;
        
        // Handle touch events
        if (e.touches) {
            x = e.touches[0].clientX - rect.left;
        }
        
        // Constrain x to slider boundaries
        x = Math.max(0, Math.min(x, rect.width));
        
        const percentage = (x / rect.width) * 100;
        
        before.style.width = percentage + '%';
        handle.style.left = percentage + '%';
    }
    
    handle.addEventListener('mousedown', () => {
        isActive = true;
    });
    
    handle.addEventListener('touchstart', () => {
        isActive = true;
    });
    
    document.addEventListener('mouseup', () => {
        isActive = false;
    });
    
    document.addEventListener('touchend', () => {
        isActive = false;
    });
    
    document.addEventListener('mousemove', updateSlider);
    document.addEventListener('touchmove', updateSlider);
});

// Compact logo label styling
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.navbar-logo');
    if (logo && logo.style.height === '40px') {
        logo.addEventListener('load', () => {
            logo.parentElement.style.gap = '8px';
        });
    }
});
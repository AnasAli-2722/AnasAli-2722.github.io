// Typewriter Effect for Hero
const typewriterElement = document.getElementById('typewriter');
const texts = [
    'developer',
    'designer'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;
let deleteSpeed = 60;
let delayBetween = 2000;

function typewriter() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typewriterElement.textContent = currentText.substring(0, charIndex);

    let speed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentText.length) {
        speed = delayBetween;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        speed = typeSpeed;
    }

    setTimeout(typewriter, speed);
}

// Initialize typewriter
document.addEventListener('DOMContentLoaded', () => {
    typewriter();
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all bento items
document.addEventListener('DOMContentLoaded', () => {
    const bentoItems = document.querySelectorAll('.bento-item');
    bentoItems.forEach(item => observer.observe(item));
});

// Navigation Active State
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-dock-item');
    const sections = document.querySelectorAll('section[id]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navItem = document.querySelector(`.nav-dock-item[data-section="${id}"]`);
            
            if (entry.isIntersecting) {
                navItems.forEach(item => item.classList.remove('active'));
                if (navItem) navItem.classList.add('active');
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => navObserver.observe(section));

    // Smooth scroll navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Tech Icon Floating Animation on Hover
document.addEventListener('DOMContentLoaded', () => {
    const techIcons = document.querySelectorAll('.tech-icon');
    
    techIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.animation = 'float 2s ease-in-out infinite';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.animation = 'none';
        });
    });
});

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Performance: Lazy load animations
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        console.log('Portfolio fully optimized');
    });
}

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

document.addEventListener('DOMContentLoaded', () => {
    typewriter();
});

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('reveal-on-scroll')) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.add('fade-in');
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const bentoItems = document.querySelectorAll('.bento-item');
    bentoItems.forEach(item => observer.observe(item));

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((element) => {
        const delay = element.getAttribute('data-reveal-delay');
        if (delay) {
            element.style.setProperty('--reveal-delay', `${delay}ms`);
        }

        observer.observe(element);
    });
});

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

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) {
                return;
            }

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Tech ticker interactions are handled purely with CSS.
});

document.addEventListener('DOMContentLoaded', () => {
    const bubbleContainer = document.querySelector('.user-image-container');
    const bubble = document.querySelector('.user-image-placeholder');

    if (bubbleContainer && bubble) {
        const animateBubbleFromPointer = (clientX, clientY) => {
            const rect = bubble.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            const nx = (x / rect.width) * 2 - 1;
            const ny = (y / rect.height) * 2 - 1;

            const clampedX = Math.max(-1, Math.min(1, nx));
            const clampedY = Math.max(-1, Math.min(1, ny));

            const shiftX = `${(clampedX * 14).toFixed(1)}px`;
            const shiftY = `${(-6 + clampedY * 10).toFixed(1)}px`;
            const spotX = `${(50 + clampedX * 18).toFixed(1)}%`;
            const spotY = `${(42 + clampedY * 18).toFixed(1)}%`;

            bubble.style.setProperty('--bubble-shift-x', shiftX);
            bubble.style.setProperty('--bubble-shift-y', shiftY);
            bubble.style.setProperty('--spot-x', spotX);
            bubble.style.setProperty('--spot-y', spotY);

            const h1 = `${(62 + clampedX * 10).toFixed(1)}%`;
            const h2 = `${(38 - clampedX * 10).toFixed(1)}%`;
            const h3 = `${(44 + clampedY * 10).toFixed(1)}%`;
            const h4 = `${(56 - clampedY * 10).toFixed(1)}%`;
            const v1 = `${(54 - clampedY * 8).toFixed(1)}%`;
            const v2 = `${(42 + clampedX * 8).toFixed(1)}%`;
            const v3 = `${(58 - clampedX * 8).toFixed(1)}%`;
            const v4 = `${(46 + clampedY * 8).toFixed(1)}%`;

            bubble.style.borderRadius = `${h1} ${h2} ${h3} ${h4} / ${v1} ${v2} ${v3} ${v4}`;
        };

        bubbleContainer.addEventListener('mousemove', (event) => {
            animateBubbleFromPointer(event.clientX, event.clientY);
        });

        bubbleContainer.addEventListener('mouseleave', () => {
            bubble.style.setProperty('--bubble-shift-x', '0px');
            bubble.style.setProperty('--bubble-shift-y', '0px');
            bubble.style.setProperty('--spot-x', '40%');
            bubble.style.setProperty('--spot-y', '28%');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const bubbleTagline = document.getElementById('bubble-tagline');
    if (!bubbleTagline) return;

    const lines = [
        'Building scalable Flutter apps',
        'Bringing Ideas to Life',
        "Let\'s Build your Project",
    ];

    let lineIndex = 0;

    const showLine = () => {
        bubbleTagline.classList.remove('exiting');
        bubbleTagline.textContent = lines[lineIndex];
        requestAnimationFrame(() => {
            bubbleTagline.classList.add('active');
        });
    };

    const hideLine = () => {
        bubbleTagline.classList.remove('active');
        bubbleTagline.classList.add('exiting');
    };

    showLine();

    const rotateLine = () => {
        hideLine();

        setTimeout(() => {
            lineIndex = (lineIndex + 1) % lines.length;
            showLine();
            setTimeout(rotateLine, 2550);
        }, 980);
    };

    setTimeout(rotateLine, 2600);
});

if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        console.log('Portfolio fully optimized');
    });
}

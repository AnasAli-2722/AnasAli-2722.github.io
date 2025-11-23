document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('i');

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme');

    // Default is dark mode (no class needed as per CSS variables), light mode adds 'data-theme="light"'
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        document.documentElement.removeAttribute('data-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentTheme === 'light') {
            // Switch to Dark
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            // Switch to Light
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    // --- Live Clock Logic ---
    function updateTime() {
        const timeDisplay = document.getElementById('local-time');
        if (timeDisplay) {
            const now = new Date();
            // Format time as HH:MM:SS AM/PM
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            timeDisplay.textContent = timeString;
        }
    }

    // Update immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
});

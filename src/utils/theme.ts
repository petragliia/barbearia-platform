export function setTheme(theme: 'light' | 'dark') {
    // Save the theme in a cookie for 1 year
    document.cookie = `theme=${theme}; path=/; max-age=31536000`;

    // Update the DOM immediately to reflect the change
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

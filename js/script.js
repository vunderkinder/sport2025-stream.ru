let allMatches = []; // глобальная переменная для хранения всех матчей

// Загрузка матчей с matches.json
function loadMatches() {
    fetch('matches.json')
        .then(response => response.json())
        .then(data => {
            allMatches = data;
            renderMatches(allMatches);
        })
        .catch(error => console.error('Ошибка загрузки матчей:', error));
}

// Рендеринг матчей
function renderMatches(matches) {
    const matchList = document.getElementById('match-list');
    matchList.innerHTML = '';

    matches.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';
        matchDiv.innerHTML = `
            <div>
                <img src="${match.image}" alt="${match.title}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 5px;" />
                <strong>${match.date} ${match.time}</strong><br>
                ${match.title}
            </div>
            <button onclick="playStream('${match.stream}', 'm3u8')">Смотреть</button>
        `;
        matchList.appendChild(matchDiv);
    });
}

// Фильтрация по категории
function showCategory(category) {
    const filteredMatches = allMatches.filter(match => match.category.toLowerCase() === category.toLowerCase());
    renderMatches(filteredMatches);
}

// При загрузке страницы — загружаем матчи и проверяем тему
document.addEventListener('DOMContentLoaded', () => {
    loadMatches();

    // Проверим saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Переключение темы (светлая/тёмная)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');

    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}


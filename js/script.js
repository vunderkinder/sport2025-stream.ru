let currentCategory = 'все';
let allMatches = [];

// Функция рендеринга матчей
function renderMatches(matches) {
    const matchList = document.getElementById('match-list');
    matchList.innerHTML = '';

    matches.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match-item';

        const imgSrc = `img/clubwc/${match.image}`;

        const date = new Date(match.date);
        const formattedDate = isNaN(date) ? 'Дата не указана' : date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        matchDiv.innerHTML = `
            <div class="tournament-name">${match.tournament}</div>
            <img src="${imgSrc}" alt="${match.title}" class="match-thumb">
            <div class="match-info">
                <strong>${match.title}</strong><br/>
                ${formattedDate}
            </div>
            <button class="watch-btn" onclick="playStream('${match.url}', '${match.type}')">Смотреть</button>
        `;

        matchList.appendChild(matchDiv);
    });
}
function playStream(url, type) {
    window.open(url, '_blank');
}

function showCategory(category) {
    currentCategory = category;
    if (category === 'все') {
        renderMatches(allMatches);
    } else {
        const filtered = allMatches.filter(match => match.category.toLowerCase() === category.toLowerCase());
        renderMatches(filtered);
    }
}

function loadMatches() {
    fetch('matches.json')
        .then(response => response.json())
        .then(data => {
            allMatches = data;
            showCategory(currentCategory);
        })
        .catch(err => console.error('Ошибка загрузки матчей:', err));
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    loadMatches();
});

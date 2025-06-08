let currentCategory = 'все';
let allMatches = [];

function renderMatches(matches) {
    const matchList = document.getElementById('match-list');
    matchList.innerHTML = '';

    if (matches.length === 0) {
        matchList.innerHTML = '<p>Нет матчей в этой категории.</p>';
        return;
    }

    matches.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match-card';

        matchDiv.innerHTML = `
            <img src="${match.image}" alt="${match.title}" class="match-img" />
            <div class="match-info">
                <strong>${match.title}</strong><br/>
                ${match.date}<br/>
                <button onclick="playStream('${match.url}', '${match.type}')">Смотреть</button>
            </div>
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

// Глобальная переменная — текущая категория
let currentCategory = 'все';

// Функция запуска стрима
function playStream(url, type) {
    const youtubePlayer = document.getElementById('youtubePlayer');
    const videoPlayer = document.getElementById('videoPlayer');
    const ytFrame = document.getElementById('ytFrame');

    if (type === 'youtube') {
        videoPlayer.style.display = 'none';
        videoPlayer.pause();

        youtubePlayer.style.display = 'block';
        ytFrame.src = url;
    } else if (type === 'm3u8') {
        youtubePlayer.style.display = 'none';
        ytFrame.src = '';

        videoPlayer.src = url;
        videoPlayer.style.display = 'block';
        videoPlayer.load();
        videoPlayer.play();
    }
}

// Генератор URL по source и id
function generateUrl(source, id) {
    if (source === 'youtube') {
        return `https://www.youtube.com/embed/${id}`;
    } else if (source === 'm3u8') {
        return id; // для m3u8 ссылка уже полная
    } else {
        console.warn('Неизвестный source:', source);
        return '';
    }
}

// Устанавливаем выбранную категорию
function setCategory(category) {
    currentCategory = category;
    loadMatches();

    // Подсветка активной категории
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active-category'));

    // Ищем кнопку с выбранной категорией
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase() === category) {
            btn.classList.add('active-category');
        }
    });
}

// Функция рендеринга матчей
function renderMatches(matches) {
    const matchList = document.querySelector('.match-list');
    matchList.innerHTML = '';

    matches.forEach(match => {
        // Фильтр по категории
        if (currentCategory !== 'все' && match.category !== currentCategory) {
            return; // пропускаем не ту категорию
        }

        const url = generateUrl(match.source, match.id);

        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';

        matchDiv.innerHTML = `
            <p><strong>${match.time}</strong> — ${match.title} (${match.category})</p>
            <button onclick="playStream('${url}', '${match.type}')">Смотреть</button>
        `;

        matchList.appendChild(matchDiv);
    });
}

// Загрузка матчей из matches.json с анти-кешем
function loadMatches() {
    fetch('matches.json?nocache=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            renderMatches(data);
        })
        .catch(error => {
            console.error('Ошибка загрузки матчей:', error);
        });
}

// При загрузке страницы — загружаем матчи
document.addEventListener('DOMContentLoaded', loadMatches);

// Переключение темы
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}
// Переключение темы (светлая/тёмная)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');

    // Можно сохранить в localStorage, чтобы при следующем заходе запомнилось
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// При загрузке страницы — проверим saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

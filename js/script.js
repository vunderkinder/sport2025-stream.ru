// Глобальная переменная — текущая категория
let currentCategory = 'все';

// Функция запуска стрима
function playStream(url, type) {
    const ytPlayer = document.getElementById('youtubePlayer');
    const ytFrame = document.getElementById('ytFrame');
    const videoPlayer = document.getElementById('videoPlayer');

    if (type === 'youtube') {
        videoPlayer.style.display = 'none';
        videoPlayer.pause();

        ytPlayer.style.display = 'block';
        ytFrame.src = url;
    } else if (type === 'm3u8') {
        ytPlayer.style.display = 'none';
        ytFrame.src = '';

        videoPlayer.style.display = 'block';

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(videoPlayer);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                videoPlayer.play();
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = url;
            videoPlayer.addEventListener('loadedmetadata', function () {
                videoPlayer.play();
            });
        } else {
            alert('Ваш браузер не поддерживает HLS (m3u8)');
        }
    }
}

// Генератор URL по source и id — (пока не используется)
function generateUrl(source, id) {
    return source + id;
}

// Устанавливаем выбранную категорию
function setCategory(category) {
    currentCategory = category;
    showCategory(category);

    // Обновим подсветку кнопок
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = Array.from(document.querySelectorAll('.category-btn')).find(btn => btn.textContent.trim().toLowerCase() === category.toLowerCase());
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Функция рендеринга матчей
function renderMatches(matches) {
    const matchList = document.getElementById('match-list');
    matchList.innerHTML = '';

    matches.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';

        const img = document.createElement('img');
        img.src = match.image;
        img.alt = match.title;

        const text = document.createElement('div');
        text.innerHTML = `<strong>${match.title}</strong> <br> ${match.date}`;

        const button = document.createElement('button');
        button.textContent = 'Смотреть';
        button.onclick = () => playStream(match.url, match.type);

        matchDiv.appendChild(img);
        matchDiv.appendChild(text);
        matchDiv.appendChild(button);

        matchList.appendChild(matchDiv);
    });
}

let allMatches = [];

// Загрузка матчей с matches.json
function loadMatches() {
    fetch('matches.json')
        .then(response => response.json())
        .then(data => {
            allMatches = data;
            showCategory(currentCategory);
        })
        .catch(error => console.error('Ошибка загрузки матчей:', error));
}

// Фильтрация по категории
function showCategory(category) {
    const filteredMatches = category === 'все'
        ? allMatches
        : allMatches.filter(match => match.category.toLowerCase() === category.toLowerCase());

    renderMatches(filteredMatches);
}

// При загрузке страницы — загружаем матчи и тему
document.addEventListener('DOMContentLoaded', () => {
    loadMatches();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Переключение темы
function toggleTheme() {
    document.body.classList.toggle('dark-theme');

    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

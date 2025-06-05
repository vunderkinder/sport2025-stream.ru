// script.js
// Обновляем заголовок с сегодняшней датой
document.addEventListener('DOMContentLoaded', () => {
    const matchTitle = document.getElementById('matchTitle');
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    matchTitle.textContent = `Сегодняшние матчи — ${today.toLocaleDateString('ru-RU', options)}`;
});

// Список матчей
const matches = [
    {
        time: "21:00",
        title: "Реал Мадрид vs Ман Сити",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        type: "m3u8"
    },
    {
        time: "22:00",
        title: "Барселона vs Бавария",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "youtube"
    }
];

// Функция генерации списка матчей
function renderMatches() {
    const matchList = document.querySelector('.match-list');
    matchList.innerHTML = '';

    matches.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';

        const button = `<button onclick="playStream('${match.url}', '${match.type}')">Смотреть</button>`;

        matchDiv.innerHTML = `<strong>${match.time}</strong> — ${match.title} ${button}`;
        matchList.appendChild(matchDiv);
    });
}

// Функция запуска стрима
function playStream(url, type) {
    const youtubePlayer = document.getElementById('youtubePlayer');
    const videoPlayer = document.getElementById('videoPlayer');

    if (type === 'youtube') {
        videoPlayer.style.display = 'none';
        youtubePlayer.style.display = 'block';
        document.getElementById('ytFrame').src = url;
    } else if (type === 'm3u8') {
        youtubePlayer.style.display = 'none';
        document.getElementById('ytFrame').src = '';

        videoPlayer.src = url;
        videoPlayer.style.display = 'block';
        videoPlayer.load();
        videoPlayer.play();
    }
}

// При загрузке страницы — отрисуем матчи
document.addEventListener('DOMContentLoaded', renderMatches);

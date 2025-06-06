// Функция запуска стрима
function playStream(url, type) {
    const youtubePlayer = document.getElementById('youtubePlayer');
    const videoPlayer = document.getElementById('videoPlayer');
    const ytFrame = document.getElementById('ytFrame');

    if (type === 'youtube') {
        videoPlayer.style.display = 'none';
        videoPlayer.pause();

        ytFrame.src = url;
        ytFrame.style.display = 'block';
    } else if (type === 'm3u8') {
        ytFrame.style.display = 'none';
        ytFrame.src = '';

        videoPlayer.src = url;
        videoPlayer.style.display = 'block';
        videoPlayer.load();
        videoPlayer.play();
    }
}

// Функция рендеринга матчей
function renderMatches(matches) {
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

// Загрузка матчей из matches.json
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

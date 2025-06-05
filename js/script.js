// 1. МАССИВ МАТЧЕЙ
const matches = [
    {
        time: '21:00',
        title: 'Реал Мадрид vs Ман Сити',
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        type: 'm3u8'
    },
    {
        time: '22:00',
        title: 'Барселона vs Бавария',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        type: 'youtube'
    },
    {
        time: '23:00',
        title: 'Ювентус vs ПСЖ',
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        type: 'm3u8'
    }
];

// 2. ФУНКЦИЯ — рисуем матчи
function renderMatches() {
    const matchList = document.getElementById('match-list');
    matchList.innerHTML = '';

    matches.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.classList.add('match');

        matchDiv.innerHTML = `
            <p><strong>${match.time}</strong> — ${match.title}</p>
            <button onclick="playStream('${match.url}', '${match.type}')">Смотреть</button>
        `;

        matchList.appendChild(matchDiv);
    });
}

// 3. ФУНКЦИЯ — запуск стрима
function playStream(url, type) {
    const youtubePlayer = document.getElementById('youtubePlayer');
    const ytFrame = document.getElementById('ytframe');
    const videoPlayer = document.getElementById('videoPlayer');

    if (type === 'youtube') {
        videoPlayer.style.display = 'none';
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

// 4. При загрузке страницы — рисуем матчи
document.addEventListener('DOMContentLoaded', renderMatches);

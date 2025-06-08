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
    const matchList = document.getElementById('match-list');
    matchList.innerHTML = '';

    matches.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';
        matchDiv.innerHTML = `
            <div>
                <strong>${match.date} ${match.time}</strong><br>
                ${match.title}
            </div>
            <button onclick="loadMatch('${match.stream}')">Смотреть</button>
        `;
        matchList.appendChild(matchDiv);

        // ===== Микроразметка Event для Google =====
        const eventData = {
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            "name": `${match.title}`,
            "startDate": `${match.date}T${match.time}:00+03:00`,
            "location": {
                "@type": "Place",
                "name": "FIFA Club World Cup Stadium",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Джидда",
                    "addressCountry": "SA"
                }
            },
            "url": "https://vunderkinder.github.io/sport2025-stream.ru/",
            "performer": [
                {
                    "@type": "SportsTeam",
                    "name": match.title.split(' — ')[0]
                },
                {
                    "@type": "SportsTeam",
                    "name": match.title.split(' — ')[1] || "Неизвестный соперник"
                }
            ],
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode"
        };

        const ldJsonScript = document.createElement('script');
        ldJsonScript.type = 'application/ld+json';
        ldJsonScript.textContent = JSON.stringify(eventData, null, 2);
        document.body.appendChild(ldJsonScript);
    });
}


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

// Фильтрация по категории
function showCategory(category) {
    const filteredMatches = allMatches.filter(match => match.category.toLowerCase() === category.toLowerCase());
    renderMatches(filteredMatches);
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

document.addEventListener('DOMContentLoaded', () => {
    const name = document.querySelector('.name');
    const surpriseBtn = document.getElementById('surpriseBtn');
    const fireworks = document.querySelector('.fireworks');
    const floatingImagesContainer = document.getElementById('floatingImages');
    let isFirstPlay = true;
    let audio = null;

    // İsme tıklayınca renk değiştirme
    name.addEventListener('click', () => {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        name.style.color = "#" + randomColor;
    });

    // Sürpriz butonu
    surpriseBtn.addEventListener('click', () => {
        createFireworks();
        playMusicOnce();
        createFloatingImages();
        showSurpriseImage(); // Add this line
    });

    // Konami kodu
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiCodePosition = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiCodePosition]) {
            konamiCodePosition++;
            if (konamiCodePosition === konamiCode.length) {
                activateSnowfall();
                konamiCodePosition = 0;
            }
        } else {
            konamiCodePosition = 0;
        }
    });

    function createFireworks() {
        for (let i = 0; i < 5; i++) {
            const firework = document.createElement('div');
            firework.style.position = 'absolute';
            firework.style.width = '5px';
            firework.style.height = '5px';
            firework.style.borderRadius = '50%';
            firework.style.backgroundColor = getRandomColor();
            firework.style.left = Math.random() * window.innerWidth + 'px';
            firework.style.top = Math.random() * window.innerHeight + 'px';
            fireworks.appendChild(firework);

            animateFirework(firework);
        }
    }

    function animateFirework(firework) {
        let opacity = 1;
        const animation = setInterval(() => {
            opacity -= 0.01;
            firework.style.opacity = opacity;

            if (opacity <= 0) {
                clearInterval(animation);
                fireworks.removeChild(firework);
            }
        }, 20);
    }

    function getRandomColor() {
        return `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    function playMusicOnce() {
        if (isFirstPlay) {
            audio = new Audio('muzik.mp3');
            audio.play();
            isFirstPlay = false;

            // Şarkı bittiğinde isFirstPlay'i sıfırla
            audio.addEventListener('ended', () => {
                isFirstPlay = true;
            });
        }
    }

    function createFloatingImages() {
        const images = [
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuok9V5iRG6NrXVpbnOaZAoojJJP5JPpAswA&s',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYDqtw-75z53LQWe57j34FytISszn9PTZlmw&s'
        ];

        images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.className = 'floating-image';
            img.src = imgSrc;
            img.alt = 'Floating Image';
            floatingImagesContainer.appendChild(img);

            // Rastgele başlangıç pozisyonu
            const startPosition = getRandomStartPosition();
            img.style.left = startPosition.x + 'px';
            img.style.top = startPosition.y + 'px';

            // Hareketi başlat
            moveImage(img);
        });
    }

    function getRandomStartPosition() {
        const side = Math.floor(Math.random() * 4); // 0: üst, 1: sağ, 2: alt, 3: sol
        let x, y;

        switch(side) {
            case 0: // üst
                x = Math.random() * window.innerWidth;
                y = -100;
                break;
            case 1: // sağ
                x = window.innerWidth + 100;
                y = Math.random() * window.innerHeight;
                break;
            case 2: // alt
                x = Math.random() * window.innerWidth;
                y = window.innerHeight + 100;
                break;
            case 3: // sol
                x = -100;
                y = Math.random() * window.innerHeight;
                break;
        }

        return { x, y };
    }

    function moveImage(img) {
        const speed = 2;
        let angle = Math.random() * Math.PI * 2;
        let rotation = 0;

        function animate() {
            const rect = img.getBoundingClientRect();
            let x = parseFloat(img.style.left);
            let y = parseFloat(img.style.top);

            // Hareket
            x += Math.cos(angle) * speed;
            y += Math.sin(angle) * speed;

            // Rotasyon
            rotation += 0.5;
            img.style.transform = `rotate(${rotation}deg)`;

            // Pozisyonu güncelle
            img.style.left = x + 'px';
            img.style.top = y + 'px';

            // Ekrandan çıktı mı kontrol et
            if (x < -100 || x > window.innerWidth + 100 || 
                y < -100 || y > window.innerHeight + 100) {
                // Yeni başlangıç pozisyonu
                const newPos = getRandomStartPosition();
                img.style.left = newPos.x + 'px';
                img.style.top = newPos.y + 'px';
                angle = Math.random() * Math.PI * 2;
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    function activateSnowfall() {
        const snowflakes = 50;
        const snowflakeContainer = document.createElement('div');
        snowflakeContainer.style.position = 'fixed';
        snowflakeContainer.style.top = '0';
        snowflakeContainer.style.left = '0';
        snowflakeContainer.style.width = '100%';
        snowflakeContainer.style.height = '100%';
        snowflakeContainer.style.overflow = 'hidden';
        snowflakeContainer.style.pointerEvents = 'none';
        document.body.appendChild(snowflakeContainer);

        for (let i = 0; i < snowflakes; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.style.left = `${Math.random() * 100}vw`;
            snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
            snowflake.style.opacity = Math.random();
            snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;
            snowflake.innerHTML = '❄️';
            snowflakeContainer.appendChild(snowflake);
        }
    }

    // Add this new function for the surprise image
    function showSurpriseImage() {
        // Remove existing surprise image if any
        const existingContainer = document.querySelector('.surprise-image-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Create container
        const container = document.createElement('div');
        container.className = 'surprise-image-container';

        // Create image
        const image = document.createElement('img');
        image.className = 'surprise-image';
        image.src = 'myp.jpg';
        image.alt = 'Surprise Image';

        // Create text overlay
        const text = document.createElement('div');
        text.className = 'surprise-text';
        text.textContent = 'HAPPY NEW YEAR ADA';

        // Add elements to container
        container.appendChild(image);
        container.appendChild(text);
        document.body.appendChild(container);

        // Trigger animations
        setTimeout(() => {
            container.classList.add('visible');
            setTimeout(() => {
                text.classList.add('visible');
            }, 500);
        }, 100);
    }
});


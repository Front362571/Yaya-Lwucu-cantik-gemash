// ===== CONFIGURATION =====
const CONFIG = {
    typingSpeed: 50,
    gameTime: 45,
    starSpawnRate: 600,
    shootingStarInterval: 3000,
    particleCount: 50
};

// ===== TYPING EFFECT =====
const messages = [
    "Sayangku yang tercinta... 💙",
    "Di antara miliaran bintang di galaksi ini, kamu adalah yang paling terang benderang ✨",
    "Seperti gravitasi yang mengikat planet, cintaku padamu tak dapat ditolak 🌍",
    "Setiap detak jantungku berbisik namamu di keheningan luar angkasa 💓",
    "Terima kasih telah menjadi cahaya dalam kegelapaaan hidupku 🌟",
    "I love you to the moon and back... and to infinity! 🚀💫"
];

let messageIndex = 0;
let charIndex = 0;
let typingElement = document.getElementById('typingText');

function typeMessage() {
    if (!typingElement) return;
    
    if (messageIndex < messages.length) {
        if (charIndex < messages[messageIndex].length) {
            typingElement.textContent += messages[messageIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeMessage, CONFIG.typingSpeed);
        } else {
            setTimeout(() => {
                messageIndex++;
                charIndex = 0;
                typingElement.textContent = '';
                typeMessage();
            }, 2000);
        }
    } else {
        messageIndex = 0;
        setTimeout(() => {
            typingElement.textContent = '';
            typeMessage();
        }, 3000);
    }
}

// ===== COUNTER ANIMATION =====
// Ganti tanggal ini dengan tanggal pertama pacaran/kenalan
const startDate = new Date('2023-02-14T00:00:00');

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    animateCounter('daysCounter', days);
    animateCounter('hoursCounter', hours);
    animateCounter('minutesCounter', minutes);
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue !== targetValue) {
        const increment = targetValue > currentValue ? 1 : -1;
        const duration = 1000;
        const steps = Math.abs(targetValue - currentValue);
        const stepDuration = duration / steps;
        
        let current = currentValue;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if (current === targetValue) {
                clearInterval(timer);
            }
        }, stepDuration);
    }
}

// ===== SHOOTING STARS =====
function createShootingStar() {
    const container = document.getElementById('shootingStars');
    if (!container) return;
    
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.top = Math.random() * 50 + '%';
    star.style.left = Math.random() * 100 + '%';
    
    container.appendChild(star);
    
    setTimeout(() => {
        star.remove();
    }, 3000);
}

// ===== GAME LOGIC =====
let gameScore = 0;
let gameTimeLeft = CONFIG.gameTime;
let gameActive = false;
let gameInterval = null;
let timerInterval = null;
let bestScore = localStorage.getItem('bestScore') || 0;

document.getElementById('bestScore').textContent = bestScore;

const startGameBtn = document.getElementById('startGameBtn');
const gameArena = document.getElementById('gameArena');
const gameResult = document.getElementById('gameResult');

startGameBtn.addEventListener('click', startGame);

function startGame() {
    // Reset
    gameScore = 0;
    gameTimeLeft = CONFIG.gameTime;
    gameActive = true;
    
    // Update UI
    document.getElementById('gameScore').textContent = gameScore;
    document.getElementById('gameTime').textContent = gameTimeLeft;
    document.getElementById('gameReady').style.display = 'none';
    gameResult.style.display = 'none';
    gameArena.innerHTML = '';
    
    // Disable button
    startGameBtn.disabled = true;
    startGameBtn.style.opacity = '0.5';
    startGameBtn.querySelector('.button-text').textContent = 'GAME ACTIVE';
    
    // Start spawning stars
    gameInterval = setInterval(spawnGameStar, CONFIG.starSpawnRate);
    
    // Start timer
    timerInterval = setInterval(() => {
        gameTimeLeft--;
        document.getElementById('gameTime').textContent = gameTimeLeft;
        
        if (gameTimeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function spawnGameStar() {
    if (!gameActive) return;
    
    const star = document.createElement('div');
    star.className = 'game-star';
    
    const starTypes = ['⭐', '🌟', '✨', '💫', '🌠'];
    const randomStar = starTypes[Math.floor(Math.random() * starTypes.length)];
    star.textContent = randomStar;
    
    // Random position
    const maxLeft = gameArena.offsetWidth - 60;
    star.style.left = Math.random() * maxLeft + 'px';
    star.style.top = '-60px';
    
    // Click handler
    star.addEventListener('click', function() {
        gameScore++;
        document.getElementById('gameScore').textContent = gameScore;
        
        // Visual feedback
        this.style.transform = 'scale(0)';
        this.style.transition = 'transform 0.2s';
        
        // Create sparkle effect
        createSparkleEffect(this.offsetLeft, this.offsetTop);
        
        setTimeout(() => this.remove(), 200);
    });
    
    gameArena.appendChild(star);
    
    // Remove if not clicked
    setTimeout(() => {
        if (star.parentNode) {
            star.remove();
        }
    }, 4000);
}

function createSparkleEffect(x, y) {
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.fontSize = '25px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'sparkleExplosion 0.6s ease-out';
        
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 50;
        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;
        
        sparkle.style.setProperty('--moveX', moveX + 'px');
        sparkle.style.setProperty('--moveY', moveY + 'px');
        
        gameArena.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 600);
    }
}

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleExplosion {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--moveX), var(--moveY)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    // Clear arena
    gameArena.innerHTML = '';
    
    // Check best score
    if (gameScore > bestScore) {
        bestScore = gameScore;
        localStorage.setItem('bestScore', bestScore);
        document.getElementById('bestScore').textContent = bestScore;
    }
    
    // Show result
    document.getElementById('finalGameScore').textContent = gameScore;
    
    let message = '';
    if (gameScore >= 60) {
        message = '🏆 AMAZING! Kamu adalah master menangkap bintang! Cintamu luar biasa! 💖';
    } else if (gameScore >= 40) {
        message = '🌟 EXCELLENT! Kamu hebat sekali sayang! Cinta kita sekuat gravitasi! 💫';
    } else if (gameScore >= 25) {
        message = '✨ GREAT JOB! Kamu sudah bagus kok! Terus berlatih ya! 💙';
    } else if (gameScore >= 10) {
        message = '💫 GOOD TRY! Tidak apa-apa, yang penting kita bersenang-senang! 😊';
    } else {
        message = '💝 Tidak masalah sayang, cintaku padamu tetap tak terhingga! 💕';
    }
    
    document.getElementById('resultMessage').textContent = message;
    gameResult.style.display = 'block';
    
    // Enable button
    startGameBtn.disabled = false;
    startGameBtn.style.opacity = '1';
    startGameBtn.querySelector('.button-text').textContent = 'PLAY AGAIN';
    
    // Celebration
    celebrate();
}

function celebrate() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createCelebrationStar();
        }, i * 100);
    }
}

function createCelebrationStar() {
    const star = document.createElement('div');
    star.style.position = 'fixed';
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.top = '-50px';
    star.style.fontSize = '40px';
    star.style.pointerEvents = 'none';
    star.style.zIndex = '10000';
    star.textContent = ['⭐', '🌟', '✨', '💫', '🌠'][Math.floor(Math.random() * 5)];
    star.style.animation = 'fallDown 3s linear';
    
    document.body.appendChild(star);
    
    setTimeout(() => star.remove(), 3000);
}

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(${91 + Math.random() * 50}, ${192 + Math.random() * 50}, ${190 + Math.random() * 50}, ${Math.random() * 0.5 + 0.3})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(91, 192, 190, ${1 - distance / 100})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    initParticles();
    animateParticles();
}

// ===== MUSIC PLAYER =====
const musicToggle = document.getElementById('musicToggle');
const musicWaves = document.querySelector('.music-waves');
let isPlaying = false;

// Note: Tambahkan file audio sendiri atau gunakan Web Audio API
musicToggle.addEventListener('click', () => {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        musicWaves.classList.add('active');
        musicToggle.querySelector('.music-icon').textContent = '🔊';
        // Play music here
    } else {
        musicWaves.classList.remove('active');
        musicToggle.querySelector('.music-icon').textContent = '🔇';
        // Pause music here
    }
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'cardAppear 0.8s ease forwards';
        }
    });
}, observerOptions);

document.querySelectorAll('.space-card').forEach(card => {
    observer.observe(card);
});

// ===== REASON STARS INTERACTION =====
document.querySelectorAll('.reason-star').forEach(star => {
    star.addEventListener('click', function() {
        this.style.transform = 'scale(1.1)';
        
        // Create particle burst
        const rect = this.getBoundingClientRect();
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createFloatingEmoji(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }, i * 50);
        }
        
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
});

function createFloatingEmoji(x, y) {
    const emoji = document.createElement('div');
    emoji.textContent = ['💙', '💫', '✨', '🌟'][Math.floor(Math.random() * 4)];
    emoji.style.position = 'fixed';
    emoji.style.left = x + 'px';
    emoji.style.top = y + 'px';
    emoji.style.fontSize = '30px';
    emoji.style.pointerEvents = 'none';
    emoji.style.zIndex = '10000';
    emoji.style.animation = 'floatUpFade 2s ease-out';
    
    document.body.appendChild(emoji);
    
    setTimeout(() => emoji.remove(), 2000);
}

// Add float up fade animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes floatUpFade {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatStyle);

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
    // Start typing effect
    setTimeout(typeMessage, 1000);
    
    // Update counter every minute
    updateCounter();
    setInterval(updateCounter, 60000);
    
    // Create shooting stars periodically
    setInterval(createShootingStar, CONFIG.shootingStarInterval);
    
    // Create initial shooting stars
    for (let i = 0; i < 3; i++) {
        setTimeout(createShootingStar, i * 1000);
    }
    
    console.log('🌌 Website Valentine Luar Angkasa siap! 💙✨');
});

// ===== PREVENT RIGHT CLICK (Optional) =====
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

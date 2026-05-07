// =====================
// LIGHT/DARK MODE TOGGLE
// =====================
const toggle = document.getElementById('theme-toggle');
const body = document.body;

// On page load, check if user previously chose dark mode
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  toggle.innerHTML = '<i class="fa-regular fa-sun"></i>'; // Font Awesome Sun Icon
}

toggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  // Update icon and save preference
  const isDark = body.classList.contains('dark-mode');
  toggle.innerHTML = isDark ? '<i class="fa-regular fa-sun"></i>' : '<i class="fa-regular fa-moon"></i>';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  // Swap particle color with mode
  window.particleColor = isDark
    ? 'rgba(166, 177, 225, 0.7)'   // light lavender for dark bg
    : 'rgba(66, 72, 116, 0.7)';    // dark purple for light bg

});

// =====================
// PARTICLE BACKGROUND
// =====================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Fewer particles on mobile to save battery
const PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 70;
const CONNECTION_DISTANCE = 120;  // max distance to draw a line between particles
const PARTICLE_SPEED = 0.4;

let particles = [];

// Fit canvas to its section
function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function createParticle() {
  return {
    x:    Math.random() * canvas.width,
    y:    Math.random() * canvas.height,
    vx:   (Math.random() - 0.5) * PARTICLE_SPEED,  // velocity x
    vy:   (Math.random() - 0.5) * PARTICLE_SPEED,  // velocity y
    size: Math.random() * 2 + 1                     // radius 1–3px
  };
}

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
}

function drawParticle(p) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fillStyle = window.particleColor || 'rgba(66, 72, 116, 0.7)';
  ctx.fill();
}

function drawConnection(p1, p2, distance) {
  const opacity = 1 - (distance / CONNECTION_DISTANCE);
  const baseColor = window.particleColor || 'rgba(66, 72, 116, 0.7)';
  // Extract rgb values and apply connection opacity
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = window.particleColor
    ? window.particleColor.replace(/[\d.]+\)$/, `${opacity * 0.4})`)
    : `rgba(66, 72, 116, ${opacity * 0.4})`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function updateParticle(p) {
  p.x += p.vx;
  p.y += p.vy;

  // Wrap around edges instead of bouncing
  if (p.x < 0) p.x = canvas.width;
  if (p.x > canvas.width) p.x = 0;
  if (p.y < 0) p.y = canvas.height;
  if (p.y > canvas.height) p.y = 0;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connections first (behind particles)
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < CONNECTION_DISTANCE) {
        drawConnection(particles[i], particles[j], distance);
      }
    }
  }

  // Draw and move particles
  particles.forEach(p => {
    drawParticle(p);
    updateParticle(p);
  });

  requestAnimationFrame(animate);
}

// Kick everything off
resizeCanvas();

window.particleColor = document.body.classList.contains('dark-mode') // set initial color based on mode before initializing particles
  ? 'rgba(166, 177, 225, 0.7)'
  : 'rgba(66, 72, 116, 0.7)';

initParticles();
animate();

// Handle window resize
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();  // re-scatter particles to fit new size
});

// =====================
// TYPEWRITER EFFECT
// =====================
const typewriterEl = document.getElementById('typewriter-text');

// Phrases to cycle through
const phrases = [
  'Machine Learning.',
  'Data Analysis.',
  'building fun things :D'
];

let phraseIndex = 0;   // which phrase we're on
let charIndex = 0;     // how far into the phrase we are
let isDeleting = false;

function typeWriter() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    // Remove one character
    typewriterEl.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character
    typewriterEl.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;
  }

  // Fully typed — pause then start deleting
  if (!isDeleting && charIndex === currentPhrase.length) {
    setTimeout(() => { isDeleting = true; }, 1500); // pause 1.5s
  }

  // Fully deleted — move to next phrase
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length; // loop back to 0
  }

  // Typing is slower than deleting — feels more natural
  const speed = isDeleting ? 60 : 110;
  setTimeout(typeWriter, speed);
}

// Kick it off
typeWriter();

// =====================
// CUSTOM CURSOR
// =====================
const cursorRing = document.getElementById('cursor-ring');
const cursorDot  = document.getElementById('cursor-dot');

// Dot snaps instantly to mouse position
document.addEventListener('mousemove', (e) => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top  = e.clientY + 'px';

  // Ring follows with a slight lag via CSS transition
  cursorRing.style.left = e.clientX + 'px';
  cursorRing.style.top  = e.clientY + 'px';
});

// Expand ring when hovering interactive elements
const interactiveEls = document.querySelectorAll('a, button, .skill-tag, .project-card');

interactiveEls.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.classList.add('hovering');
    cursorDot.classList.add('hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.classList.remove('hovering');
    cursorDot.classList.remove('hovering');
  });
});

// Compress ring on click
document.addEventListener('mousedown', () => {
  cursorRing.classList.add('clicking');
});
document.addEventListener('mouseup', () => {
  cursorRing.classList.remove('clicking');
});

// Hide cursor when it leaves the window
document.addEventListener('mouseleave', () => {
  cursorRing.style.opacity = '0';
  cursorDot.style.opacity  = '0';
});
document.addEventListener('mouseenter', () => {
  cursorRing.style.opacity = '1';
  cursorDot.style.opacity  = '1';
});

// =====================
// PROJECT FILTER (animated)
// =====================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    // Phase 1: fade all cards out
    projectCards.forEach(card => {
      card.classList.add('hiding');
    });

    setTimeout(() => {
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category.split(' ').includes(filter);

        // Remove hiding state
        card.classList.remove('hiding');

        if (match) {
          // Show matching cards — remove hidden so display:none lifts
          card.classList.remove('hidden');
          // Force reflow so the fade-in transition actually fires
          void card.offsetWidth;
          card.classList.add('showing');
          setTimeout(() => card.classList.remove('showing'), 300);
        } else {
          // Hide non-matching after fade
          card.classList.add('hidden');
        }
      });
    }, 250);
  });
});

// =====================
// SCROLL ARROWS
// =====================
const scrollContainer = document.querySelector('.project-scroll-container');
const leftArrow = document.querySelector('.scroll-arrow-left');
const rightArrow = document.querySelector('.scroll-arrow-right');

const CARD_WIDTH = 300 + 24; // card width + gap

leftArrow.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: -CARD_WIDTH, behavior: 'smooth' });
});

rightArrow.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
});

// =====================
// SCROLL REVEAL
// =====================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Stop watching once visible — no need to re-animate
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15    // fires when 15% of element is in view
});

revealElements.forEach(el => revealObserver.observe(el));

// =====================
// HAMBURGER MENU
// =====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  // Update icon
  hamburger.innerHTML = navMenu.classList.contains('open') ? '&#10005;' : '&#9776;';
});

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-link-item').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.innerHTML = '&#9776;';
  });
});
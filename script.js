const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const card = document.getElementById('card');

function placeNoButtonRandomly() {
  const containerRect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const padding = 8;
  const maxX = Math.max(0, containerRect.width - btnRect.width - padding);
  const maxY = Math.max(0, containerRect.height - btnRect.height - padding);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

// Move away on hover so it's hard to click
noBtn.addEventListener('mouseenter', () => {
  placeNoButtonRandomly();
});

// Prevent click and move if user somehow clicks
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  placeNoButtonRandomly();
});

// Confetti implementation (lightweight canvas particle system)
function createConfettiCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confettiCanvas';
  canvas.style.position = 'fixed';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  return canvas;
}

function launchConfetti({count = 80, duration = 2200} = {}) {
  const canvas = document.getElementById('confettiCanvas') || createConfettiCanvas();
  const ctx = canvas.getContext('2d');
  const colors = ['#FF6B6B', '#FFD166', '#06D6A0', '#4D96FF', '#9B5DE5'];
  let particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * 0.6,
      w: Math.random() * 8 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltSpeed: Math.random() * 0.12 + 0.02,
      speedY: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 8 - 4
    });
  }

  const start = performance.now();

  function frame(now) {
    const t = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
      p.x += Math.sin(p.tilt) * 0.6;
      p.y += p.speedY;
      p.tilt += p.tiltSpeed;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    particles = particles.filter((p) => p.y < canvas.height + 50);

    if (t < duration && particles.length) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  }

  requestAnimationFrame(frame);
}

// Yes button feedback + confetti
yesBtn.addEventListener('click', () => {
  yesBtn.textContent = 'Отлично! 😊';
  yesBtn.style.transform = 'scale(1.06)';
  launchConfetti({count: 90});
  setTimeout(() => {
    yesBtn.style.transform = '';
  }, 400);
});

// Ensure the no button stays inside after resize and resize canvas if present
window.addEventListener('resize', () => {
  noBtn.style.transform = '';
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// Initial tiny nudge so the no button isn't directly under the yes button
window.addEventListener('load', () => {
  placeNoButtonRandomly();
});

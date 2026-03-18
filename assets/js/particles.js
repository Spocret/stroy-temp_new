function useParticles(canvas) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const PARTICLE_COUNT = 60;
  const CONNECTION_DISTANCE = 120;
  const COLORS = [
    { r: 255, g: 255, b: 255 },
    { r: 255, g: 107, b: 0 },
  ];

  let particles = [];
  let animationId = null;

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  const createParticle = () => {
    const colorBase = COLORS[Math.random() < 0.75 ? 0 : 1];
    const isOrange = colorBase.r === 255 && colorBase.g === 107;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      r: colorBase.r,
      g: colorBase.g,
      b: colorBase.b,
      opacity: isOrange
        ? Math.random() * 0.3 + 0.4
        : Math.random() * 0.3 + 0.2,
    };
  };

  const initParticles = () => {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  };

  const drawParticle = (p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity})`;
    ctx.fill();
  };

  const drawConnections = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  const updateParticle = (p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) {
      p.x = 0;
      p.vx *= -1;
    } else if (p.x > canvas.width) {
      p.x = canvas.width;
      p.vx *= -1;
    }

    if (p.y < 0) {
      p.y = 0;
      p.vy *= -1;
    } else if (p.y > canvas.height) {
      p.y = canvas.height;
      p.vy *= -1;
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach((p) => {
      updateParticle(p);
      drawParticle(p);
    });
    animationId = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    resize();
    particles.forEach((p) => {
      p.x = Math.min(p.x, canvas.width);
      p.y = Math.min(p.y, canvas.height);
    });
  };

  resize();
  initParticles();
  animate();

  window.addEventListener('resize', handleResize, { passive: true });

  return () => {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
  };
}

export { useParticles };

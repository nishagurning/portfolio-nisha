document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles = [];
    const mouse = { x: -1000, y: -1000 };
    const particleCount = 42;
    let animationFrame;

    canvas.className = 'animated-background';
    document.body.prepend(canvas);

    const resizeCanvas = () => {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * pixelRatio;
        canvas.height = window.innerHeight * pixelRatio;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const createParticle = () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.8 + 0.7,
        speedX: (Math.random() - 0.5) * 0.28,
        speedY: (Math.random() - 0.5) * 0.28,
        color: Math.random() > 0.5 ? '74, 222, 128' : '34, 211, 238'
    });

    const resetParticles = () => {
        particles.length = 0;
        for (let index = 0; index < particleCount; index += 1) {
            particles.push(createParticle());
        }
    };

    const drawParticle = particle => {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${particle.color}, .75)`;
        context.shadowBlur = 12;
        context.shadowColor = `rgba(${particle.color}, .7)`;
        context.fill();
        context.shadowBlur = 0;
    };

    const drawConnections = () => {
        for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
            for (let secondIndex = firstIndex + 1; secondIndex < particles.length; secondIndex += 1) {
                const first = particles[firstIndex];
                const second = particles[secondIndex];
                const distance = Math.hypot(first.x - second.x, first.y - second.y);

                if (distance > 145) continue;

                const opacity = (1 - distance / 145) * 0.16;
                context.beginPath();
                context.moveTo(first.x, first.y);
                context.lineTo(second.x, second.y);
                context.strokeStyle = `rgba(74, 222, 128, ${opacity})`;
                context.lineWidth = 0.7;
                context.stroke();
            }
        }
    };

    const updateParticle = particle => {
        const distanceToMouse = Math.hypot(particle.x - mouse.x, particle.y - mouse.y);

        if (distanceToMouse < 130) {
            particle.x += (particle.x - mouse.x) * 0.0008;
            particle.y += (particle.y - mouse.y) * 0.0008;
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < -10 || particle.x > window.innerWidth + 10) particle.speedX *= -1;
        if (particle.y < -10 || particle.y > window.innerHeight + 10) particle.speedY *= -1;
    };

    const animate = () => {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawConnections();
        particles.forEach(particle => {
            updateParticle(particle);
            drawParticle(particle);
        });
        animationFrame = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    resetParticles();
    window.addEventListener('resize', () => {
        resizeCanvas();
        resetParticles();
    });
    window.addEventListener('pointermove', event => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }, { passive: true });
    window.addEventListener('pointerleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    if (reducedMotion) {
        particles.forEach(drawParticle);
        return;
    }

    animate();

    window.addEventListener('pagehide', () => {
        window.cancelAnimationFrame(animationFrame);
    });
});

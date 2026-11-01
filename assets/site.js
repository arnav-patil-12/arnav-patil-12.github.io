const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
        if (!target || reduceMotion) return;
        event.preventDefault();
        history.pushState(null, '', link.hash);

        const startY = window.scrollY;
        const delta = target.getBoundingClientRect().top;
        const duration = Math.min(900, Math.max(420, Math.abs(delta) * 0.45));
        let startedAt;
        let frame;
        const cleanup = () => {
          cancelAnimationFrame(frame);
          window.removeEventListener('wheel', interrupt);
          window.removeEventListener('touchstart', interrupt);
          window.removeEventListener('pointerdown', interrupt);
          window.removeEventListener('keydown', interrupt);
        };
        const interrupt = () => cleanup();
        window.addEventListener('wheel', interrupt, { passive:true, once:true });
        window.addEventListener('touchstart', interrupt, { passive:true, once:true });
        window.addEventListener('pointerdown', interrupt, { passive:true, once:true });
        window.addEventListener('keydown', interrupt, { once:true });

        const step = now => {
          if (startedAt === undefined) startedAt = now;
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          window.scrollTo(0, startY + delta * eased);
          if (progress < 1) frame = requestAnimationFrame(step);
          else cleanup();
        };
        frame = requestAnimationFrame(step);
      });
    });

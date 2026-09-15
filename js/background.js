// ========== 沉浸式动态粒子背景 ==========
class ParticleBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    this.colors = [
      [102, 126, 234],   // 紫
      [0, 245, 160],     // 青
      [255, 107, 157],   // 粉
      [79, 172, 254],    // 蓝
    ];
    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.particleCount = Math.min(
      Math.floor((this.canvas.width * this.canvas.height) / 9000),
      200
    );
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const z = Math.random() * 0.7 + 0.3;          // 深度 0.3~1
      const c = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4 * z,
        vy: (Math.random() - 0.5) * 0.4 * z,
        radius: (Math.random() * 1.8 + 0.6) * z,
        opacity: (Math.random() * 0.5 + 0.3) * z,
        z,
        color: c,
        twinkle: Math.random() * Math.PI * 2,        // 闪烁相位
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.tx = e.clientX;
      this.mouse.ty = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.tx = -9999;
      this.mouse.ty = -9999;
    });
  }

  animate() {
    // 鼠标位置平滑跟随
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.12;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.12;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.updateParticles();
    this.drawConnections();
    this.drawMouseLinks();
    this.drawParticles();

    requestAnimationFrame(() => this.animate());
  }

  updateParticles() {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    // 整体鼠标视差偏移量
    const parallaxX = (this.mouse.x - cx) * 0.015;
    const parallaxY = (this.mouse.y - cy) * 0.015;

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.twinkle += 0.02;

      // 边界回弹
      if (p.x < -50) p.x = this.canvas.width + 50;
      if (p.x > this.canvas.width + 50) p.x = -50;
      if (p.y < -50) p.y = this.canvas.height + 50;
      if (p.y > this.canvas.height + 50) p.y = -50;

      // 鼠标排斥（近处粒子被推开）
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140 && dist > 0) {
        const force = (140 - dist) / 140;
        p.x -= dx * force * 0.03 * p.z;
        p.y -= dy * force * 0.03 * p.z;
      }

      // 视差偏移（绘制时使用，不改变真实坐标）
      p.px = p.x - parallaxX * p.z;
      p.py = p.y - parallaxY * p.z;
    }
  }

  drawParticles() {
    for (const p of this.particles) {
      const tw = (Math.sin(p.twinkle) * 0.3 + 0.7);   // 闪烁系数
      const r = Math.max(0.3, p.radius);
      const [cr, cg, cb] = p.color;
      // 发光
      this.ctx.shadowBlur = r * 4;
      this.ctx.shadowColor = `rgba(${cr}, ${cg}, ${cb}, ${p.opacity * tw})`;
      this.ctx.beginPath();
      this.ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${p.opacity * tw})`;
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;
  }

  drawConnections() {
    const maxDist = 110;
    for (let i = 0; i < this.particles.length; i++) {
      const p1 = this.particles[i];
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p1.px - p2.px;
        const dy = p1.py - p2.py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.22 * Math.min(p1.z, p2.z);
          const [cr, cg, cb] = p1.color;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.px, p1.py);
          this.ctx.lineTo(p2.px, p2.py);
          this.ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  // 鼠标到附近粒子的连线（沉浸式交互）
  drawMouseLinks() {
    if (this.mouse.x < 0) return;
    const maxDist = 160;
    for (const p of this.particles) {
      const dx = this.mouse.x - p.px;
      const dy = this.mouse.y - p.py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * 0.5;
        const [cr, cg, cb] = p.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouse.x, this.mouse.y);
        this.ctx.lineTo(p.px, p.py);
        this.ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${opacity})`;
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();
      }
    }
  }
}

// ========== 渐变光斑背景 ==========
class GradientOrbs {
  constructor(container) {
    this.container = container;
    this.orbs = [];
    this.init();
  }

  init() {
    const colors = [
      'rgba(102, 126, 234, 0.15)',
      'rgba(0, 245, 160, 0.1)',
      'rgba(255, 107, 157, 0.1)',
      'rgba(79, 172, 254, 0.12)',
    ];

    for (let i = 0; i < 4; i++) {
      const orb = document.createElement('div');
      orb.style.cssText = `
        position: fixed;
        width: ${300 + Math.random() * 200}px;
        height: ${300 + Math.random() * 200}px;
        border-radius: 50%;
        background: ${colors[i]};
        filter: blur(100px);
        z-index: 0;
        pointer-events: none;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float${i} ${10 + Math.random() * 10}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      this.container.appendChild(orb);
      this.orbs.push(orb);

      // 为每个光斑创建独立动画
      const style = document.createElement('style');
      style.textContent = `
        @keyframes float${i} {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(${50 + Math.random() * 50}px, ${-30 - Math.random() * 40}px) scale(1.1);
          }
          50% {
            transform: translate(${-30 - Math.random() * 40}px, ${40 + Math.random() * 50}px) scale(0.95);
          }
          75% {
            transform: translate(${40 + Math.random() * 30}px, ${20 + Math.random() * 30}px) scale(1.05);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

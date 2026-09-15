// ========== 应用主逻辑 ==========

class CodeAdventurerApp {
  constructor() {
    this.init();
  }

  init() {
    this.initBackground();
    this.initHomePage();
    this.initRouter();
    this.initPreloader();
  }

  // 预加载流程：加载 → 平滑变形为定格按钮 → 进入网页
  initPreloader() {
    const preloader = document.getElementById('preloader');
    const loaderRing = document.getElementById('loaderRing');
    if (!preloader || !loaderRing) return;

    const minDisplayTime = 2500;
    const startTime = Date.now();
    const progressText = preloader.querySelector('.loader-ring-text');

    // 进度文字模拟
    if (progressText) {
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, Math.round((elapsed / minDisplayTime) * 100));
        progressText.textContent = progress + '%';
        if (progress >= 100) clearInterval(timer);
      }, 50);
    }

    // 加载完成：圆环凝聚成按钮，蜂巢同步绽放后定格
    setTimeout(() => {
      preloader.classList.add('ready');
      // 圆环变按钮时切换文字（延迟 0.3s 匹配圆环变形）
      setTimeout(() => {
        if (progressText) progressText.textContent = '进 入';
      }, 300);
      // LOADING → READY
      const subText = preloader.querySelector('.preloader-sub');
      if (subText) {
        subText.innerHTML = 'READY';
      }
      // 让所有六边形同步绽放：移除 animation-delay 并重启动画
      const hexagons = preloader.querySelectorAll('.honeycomb div');
      hexagons.forEach(hex => {
        hex.style.animationDelay = '0s';
        // 强制重启动画
        hex.style.animation = 'none';
        hex.offsetHeight; // 触发 reflow
        hex.style.animation = '';
      });
      // 在同步绽放的最完美时刻(1.47s，动画70%处)定格
      setTimeout(() => {
        preloader.classList.add('frozen');
        // 若用户已提前点击，定格后自动进入
        if (pendingEnter) setTimeout(doEnter, 200);
      }, 1470);
    }, minDisplayTime);

    // 点击按钮：能量波爆发 → 3D翻转退出 → 主页浮现
    // 任何时候点击都有效：未定格则等定格后自动进入
    let pendingEnter = false;
    const doEnter = () => {
      preloader.classList.add('entering');
      const appContainer = document.getElementById('appContainer');
      if (appContainer) appContainer.classList.add('entered');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 1200);
    };
    const enterAction = () => {
      // 未定格则等待，定格后由 frozen 回调触发 doEnter
      if (!preloader.classList.contains('frozen')) {
        pendingEnter = true;
        return;
      }
      doEnter();
    };

    loaderRing.addEventListener('click', enterAction);
    loaderRing.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enterAction();
      }
    });
  }

  // 初始化背景效果
  initBackground() {
    const canvas = document.getElementById('bg-canvas');
    new ParticleBackground(canvas);
    new GradientOrbs(document.body);
  }

  // 初始化首页
  initHomePage() {
    this.initLanguagePicker();
    this.initTitleAnimation();
    this.initParallax();
    this.initScreenTransition();
  }

  // 沉浸式鼠标视差：不同层以不同强度跟随鼠标
  initParallax() {
    const hero = document.querySelector('.hero-section');
    const features = document.querySelector('.features');
    const picker = document.getElementById('langPicker');
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => {
      cx = (e.clientX / window.innerWidth - 0.5) * 2;
      cy = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    const loop = () => {
      tx += (cx - tx) * 0.06;
      ty += (cy - ty) * 0.06;
      if (hero) hero.style.transform = `translate(${tx * 5}px, ${ty * 5}px)`;
      if (features) features.style.transform = `translate(${tx * 3}px, ${ty * 3}px)`;
      if (picker) picker.style.transform = `translate(${tx * -4}px, ${ty * -3}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  // ========== 两屏 transform 切换：滑动切页面，键盘/拖拽切语言 ==========
  initScreenTransition() {
    this.currentScreen = 'hero';
    this.screenLock = false;
    this.cardLock = false;

    // 滚轮：hero 屏切页面，picker 屏上下切卡片
    window.addEventListener('wheel', (e) => {
      if (this.screenLock || this.cardLock) return;
      if (this.currentScreen === 'level') return;
      const down = e.deltaY > 28;
      const up = e.deltaY < -28;
      if (!down && !up) return;

      if (this.currentScreen === 'hero') {
        if (down) this.switchScreen('picker');
      } else {
        // picker 屏：滚轮上下切卡片（双向循环，第一张快速二次上滑回 hero）
        this.cardLock = true;
        const total = window.LANGUAGES.length;
        const now = Date.now();
        if (down) {
          this.selectIndex(this.pickerIndex + 1);
          this.topLoopTime = 0;
          this.hideReturnHint();
        } else if (this.pickerIndex === 0) {
          // 第一张上滑：循环到末尾，记录时间并提示“再次上滑返回”
          this.selectIndex(this.pickerIndex - 1);
          this.topLoopTime = now;
          this.showReturnHint();
        } else if (this.pickerIndex === total - 1 && this.topLoopTime && (now - this.topLoopTime < 1200)) {
          // 刚从第一张循环到末尾，1.2 秒内继续上滑：回 hero
          this.topLoopTime = 0;
          this.hideReturnHint();
          this.switchScreen('hero');
        } else {
          this.selectIndex(this.pickerIndex - 1);
          this.topLoopTime = 0;
          this.hideReturnHint();
        }
        setTimeout(() => { this.cardLock = false; }, 550);
      }
    }, { passive: true });

    // 触摸：垂直滑动切卡片/页面
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
      if (this.screenLock || this.cardLock) return;
      if (this.currentScreen === 'level') return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 50) return;
      if (this.currentScreen === 'hero') {
        if (dy > 0) this.switchScreen('picker');
      } else {
        // picker 屏：触摸上下切卡片（双向循环，第一张快速二次上滑回 hero）
        this.cardLock = true;
        const total = window.LANGUAGES.length;
        const now = Date.now();
        if (dy > 0) {
          this.selectIndex(this.pickerIndex + 1);
          this.topLoopTime = 0;
          this.hideReturnHint();
        } else if (this.pickerIndex === 0) {
          this.selectIndex(this.pickerIndex - 1);
          this.topLoopTime = now;
          this.showReturnHint();
        } else if (this.pickerIndex === total - 1 && this.topLoopTime && (now - this.topLoopTime < 1200)) {
          this.topLoopTime = 0;
          this.hideReturnHint();
          this.switchScreen('hero');
        } else {
          this.selectIndex(this.pickerIndex - 1);
          this.topLoopTime = 0;
          this.hideReturnHint();
        }
        setTimeout(() => { this.cardLock = false; }, 550);
      }
    }, { passive: true });

    // 键盘：hero 屏切页面，picker 屏上下切卡片
    document.addEventListener('keydown', (e) => {
      if (this.currentScreen === 'level') return;
      if (this.currentScreen === 'hero') {
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          this.switchScreen('picker');
        }
      } else {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.pickerIndex === 0) this.switchScreen('hero');
          else this.selectIndex(this.pickerIndex - 1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectIndex(this.pickerIndex + 1);
        } else if (e.key === 'Enter') {
          const lang = window.LANGUAGES[this.pickerIndex];
          if (lang) this.navigateTo(`#levels/${lang.id}`);
        } else if (e.key === 'PageUp') {
          e.preventDefault();
          this.switchScreen('hero');
        }
      }
    });
  }

  switchScreen(name) {
    if (this.currentScreen === name) return;
    // 预加载器未隐藏时不响应转场
    const pl = document.getElementById('preloader');
    if (pl && getComputedStyle(pl).display !== 'none') return;
    this.currentScreen = name;
    this.screenLock = true;
    const wrapper = document.getElementById('screensWrapper');
    if (wrapper) wrapper.classList.toggle('show-picker', name === 'picker');
    setTimeout(() => { this.screenLock = false; }, 850);
  }

  // ========== 语言选择器：垂直滚轮 Picker ==========
  initLanguagePicker() {
    this.pickerIndex = 0;
    this.itemHeight = 150;
    this.isDragging = false;
    this.dragStartY = 0;
    this.dragStartOffset = 0;
    this.wheelLock = false;
    this.topLoopTime = 0;          // 从第一张循环到末尾的时间戳（边界二次滑检测）
    this.returnHintTimer = null;   // 返回提示自动隐藏计时器

    const track = document.getElementById('pickerTrack');
    const viewport = document.getElementById('pickerViewport');
    if (!track || !viewport) return;

    // 渲染抽屉式选项：头部（图标 + 语言名 + 英文名两标题）+ 可折叠详情
    track.innerHTML = window.LANGUAGES.map((lang, index) => {
      const progress = this.getProgress(lang.id);
      return `
      <div class="picker-item" data-index="${index}"
           style="--card-color-1: ${lang.color1}; --card-color-2: ${lang.color2}; --card-glow: ${lang.glow};">
        <div class="picker-card">
          <div class="picker-card-head">
            <div class="picker-item-icon">${lang.icon}</div>
            <div class="picker-item-titles">
              <div class="picker-item-name">${lang.name}</div>
              <div class="picker-item-enname">${lang.enName}</div>
            </div>
            <div class="picker-item-gameplay" style="background: ${lang.color1}20; color: ${lang.color1}; border-color: ${lang.color1}60;">
              🎮 ${lang.gameplay}
            </div>
          </div>
          <div class="picker-card-body">
            <div class="picker-item-desc">${lang.description}</div>
            <div class="picker-item-meta">
              <span>📚 ${lang.levels} 关</span>
              <span>·</span>
              <span>进度 ${progress}%</span>
            </div>
            <div class="picker-progress">
              <div class="picker-progress-bar" style="width: ${progress}%"></div>
            </div>
            <button class="picker-enter-btn">开始 ${lang.name} 之旅 →</button>
          </div>
        </div>
      </div>`;
    }).join('');

    this.updatePicker();

    // 点击选项直接选中（排除进入按钮）
    track.addEventListener('click', (e) => {
      if (this.dragMoved) return;
      const btn = e.target.closest('.picker-enter-btn');
      if (btn) {
        const lang = window.LANGUAGES[this.pickerIndex];
        if (lang) {
          this.spawnClickEffect(e.clientX, e.clientY, lang.color1, true); // 进入按钮：更强的爆发
          setTimeout(() => this.navigateTo(`#levels/${lang.id}`), 280);
        }
        return;
      }
      const item = e.target.closest('.picker-item');
      if (item) {
        const lang = window.LANGUAGES[parseInt(item.dataset.index, 10)];
        this.spawnClickEffect(e.clientX, e.clientY, lang ? lang.color1 : '#667eea', false);
        this.selectIndex(parseInt(item.dataset.index, 10));
      }
    });

    // 鼠标拖拽（滚轮/触摸/键盘已统一到转场手势）
    viewport.addEventListener('mousedown', (e) => this.onDragStart(e));
    window.addEventListener('mousemove', (e) => this.onDragMove(e));
    window.addEventListener('mouseup', (e) => this.onDragEnd(e));

    // 窗口尺寸变化时重新定位卡片
    window.addEventListener('resize', () => this.updatePicker());
  }

  // 选中指定索引（循环：首尾相连）
  selectIndex(idx) {
    const total = window.LANGUAGES.length;
    idx = ((idx % total) + total) % total;
    if (idx === this.pickerIndex) return;
    this.pickerIndex = idx;
    this.updatePicker();
  }

  // 抽屉式 3D 更新：选中项向前突出并展开，其他项循环最短距离层叠倾斜
  updatePicker() {
    const track = document.getElementById('pickerTrack');
    const viewport = document.getElementById('pickerViewport');
    if (!track || !viewport) return;

    const total = window.LANGUAGES.length;
    const half = total / 2;

    track.classList.add('smooth');
    // track 不再整体平移（卡片各自绝对定位），仅拖拽复位时使用
    track.style.transform = '';

    if (!this.lastDiffs) this.lastDiffs = new Map();

    track.querySelectorAll('.picker-item').forEach(item => {
      const i = parseInt(item.dataset.index, 10);
      let diff = i - this.pickerIndex;
      // 循环最短距离：让卡片出现在离选中项最近的循环位置
      if (diff > half) diff -= total;
      if (diff < -half) diff += total;

      const dist = Math.abs(diff);
      const dir = diff < 0 ? 1 : -1;                 // 上方向后仰(+)，下方向前倾(-)

      let z, rotX, scale, opacity, blur;
      if (dist === 0) { z = 0; rotX = 0; scale = 1; opacity = 1; blur = 0; }
      else if (dist === 1) { z = -100; rotX = 42 * dir; scale = 0.82; opacity = 0.5; blur = 1; }
      else if (dist === 2) { z = -190; rotX = 54 * dir; scale = 0.64; opacity = 0.22; blur = 3; }
      else if (dist === 3) { z = -270; rotX = 64 * dir; scale = 0.5; opacity = 0.07; blur = 5; }
      else { z = -340; rotX = 70 * dir; scale = 0.4; opacity = 0; blur = 6; }

      const y = diff * this.itemHeight;
      const transform = `translate3d(0, ${y}px, ${z}px) rotateX(${rotX}deg) scale(${scale})`;

      // 检测翻转：循环跨越边界时，dist=最大 的卡片会从一侧翻到另一侧
      // 这些卡片本身不可见(opacity:0)，瞬间跳转避免长距离滑动
      const oldDiff = this.lastDiffs.get(i);
      const flipped = oldDiff !== undefined && Math.abs(diff - oldDiff) > half;

      if (flipped) {
        item.style.transition = 'none';
        item.style.transform = transform;
        item.style.opacity = opacity;
        item.style.filter = `blur(${blur}px)`;
        item.style.zIndex = String(100 - dist);
        item.classList.toggle('active', dist === 0);
        item.offsetHeight; // 强制 reflow，让瞬间跳转生效
        item.style.transition = '';
      } else {
        item.style.transform = transform;
        item.style.opacity = opacity;
        item.style.filter = `blur(${blur}px)`;
        item.style.zIndex = String(100 - dist);
        item.classList.toggle('active', dist === 0);
      }

      this.lastDiffs.set(i, diff);
    });

    // 根据选中卡片切换动态主题背景
    this.updatePickerBackground();
  }

  // 根据当前选中的语言，切换对应的游戏主题背景
  updatePickerBackground() {
    const bgLayers = document.querySelectorAll('#pickerBg .bg-layer');
    const lang = window.LANGUAGES[this.pickerIndex];
    const gameplay = lang ? lang.gameplay : '';

    // 映射玩法名称到背景类
    const gameplayClassMap = {
      '建造师': 'bg-builder',
      '变形记': 'bg-shapeshifter',
      '魔法学院': 'bg-magic',
      '策略棋盘': 'bg-chess',
      '忍者训练': 'bg-ninja',
      '模拟机器人': 'bg-robot',
      '底层赛车': 'bg-racing',
      '射击游戏': 'bg-shooter',
      '生活模拟': 'bg-simulator',
    };

    const targetClass = gameplayClassMap[gameplay];

    bgLayers.forEach(layer => {
      const isTarget = targetClass && layer.classList.contains(targetClass);
      if (isTarget) {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
    });
  }

  // 点击特效：涟漪 + 粒子爆发（取点击位置，用主题色）
  spawnClickEffect(x, y, color, strong = false) {
    // 涟漪
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.border = `2px solid ${color}`;
    ripple.style.boxShadow = `0 0 18px ${color}`;
    if (strong) ripple.style.animationDuration = '0.9s';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);

    // 粒子
    const count = strong ? 16 : 8;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      spark.className = 'click-spark';
      spark.style.left = x + 'px';
      spark.style.top = y + 'px';
      spark.style.background = color;
      spark.style.boxShadow = `0 0 8px ${color}`;
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const dist = (strong ? 70 : 45) + Math.random() * 30;
      spark.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      spark.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    }
  }

  // 拖拽：开始
  onDragStart(e) {
    const viewport = document.getElementById('pickerViewport');
    if (!viewport) return;
    this.isDragging = true;
    this.dragMoved = false;
    this.dragStartY = e.clientY;
    viewport.classList.add('dragging');
    const track = document.getElementById('pickerTrack');
    track?.classList.remove('smooth');  // 拖拽时无过渡，跟手
  }

  // 拖拽：移动（整体偏移 track，卡片位置不动）
  onDragMove(e) {
    if (!this.isDragging) return;
    const track = document.getElementById('pickerTrack');
    if (!track) return;
    const dy = e.clientY - this.dragStartY;
    if (Math.abs(dy) > 5) this.dragMoved = true;
    track.style.transform = `translateY(${dy}px)`;
  }

  // 拖拽：结束，track 动画归零与卡片位置更新同步
  onDragEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    const viewport = document.getElementById('pickerViewport');
    viewport?.classList.remove('dragging');
    if (!this.dragMoved) return;
    const dy = (e ? e.clientY : 0) - this.dragStartY;
    // 计算拖拽后最近的索引
    let idx = Math.round(-dy / this.itemHeight) + this.pickerIndex;
    const track = document.getElementById('pickerTrack');
    if (track) {
      track.classList.add('smooth');
      track.style.transform = '';  // 动画归零（与卡片 transition 同步，视觉无跳跃）
    }
    this.selectIndex(idx);
  }

  // 显示“再次上滑返回首页”提示（循环到末尾后短暂出现）
  showReturnHint() {
    const hint = document.getElementById('returnHint');
    if (!hint) return;
    hint.classList.add('show');
    clearTimeout(this.returnHintTimer);
    this.returnHintTimer = setTimeout(() => this.hideReturnHint(), 1200);
  }

  hideReturnHint() {
    const hint = document.getElementById('returnHint');
    if (hint) hint.classList.remove('show');
    clearTimeout(this.returnHintTimer);
  }

  getProgress(langId) {
    const progress = JSON.parse(localStorage.getItem(`progress_${langId}`) || '{}');
    const total = window.LANGUAGES.find(l => l.id === langId)?.levels || 1;
    return Math.min(Math.round((progress.completed || 0) / total * 100), 100);
  }

  // 标题动画
  initTitleAnimation() {
    const subtitle = document.getElementById('brandSubtitle');
    if (!subtitle) return;

    const phrases = [
      '选择一门语言，开启你的编程之旅',
      '从零开始，循序渐进',
      '看知识点 · 写代码 · 实时预览 · 自动通关',
      '让编程学习像游戏一样有趣',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        subtitle.innerHTML = current.substring(0, charIndex--) + '<span class="cursor"></span>';
        if (charIndex < 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 30);
      } else {
        subtitle.innerHTML = current.substring(0, charIndex++) + '<span class="cursor"></span>';
        if (charIndex > current.length) {
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
        setTimeout(type, 60);
      }
    };

    type();
  }

  // 统计数据
  initStats() {
    const completed = this.getTotalCompleted();
    const totalLevels = window.LANGUAGES.reduce((sum, l) => sum + l.levels, 0);
    const mastered = this.getMasteredCount();

    this.animateNumber('statCompleted', completed);
    this.animateNumber('statTotal', totalLevels);
    this.animateNumber('statMastered', mastered);
  }

  getTotalCompleted() {
    let total = 0;
    window.LANGUAGES.forEach(lang => {
      const progress = JSON.parse(localStorage.getItem(`progress_${lang.id}`) || '{}');
      total += progress.completed || 0;
    });
    return total;
  }

  getMasteredCount() {
    let count = 0;
    window.LANGUAGES.forEach(lang => {
      const progress = JSON.parse(localStorage.getItem(`progress_${lang.id}`) || '{}');
      if (progress.completed >= lang.levels) count++;
    });
    return count;
  }

  animateNumber(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let current = 0;
    const duration = 1000;
    const increment = target / (duration / 16);

    const step = () => {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    step();
  }

  // 路由初始化
  initRouter() {
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  handleRoute() {
    const hash = window.location.hash;
    // 首页
    if (!hash || hash === '#/' || hash === '') {
      this.showHomePage();
      return;
    }
    // 关卡页：#levels/{langId}[/{index}]
    const m = hash.match(/^#levels\/([\w-]+)(?:\/(\d+))?$/);
    if (m) {
      const langId = m[1];
      const index = m[2] ? parseInt(m[2], 10) : 1;
      if (window.LevelsRuntime) {
        window.LevelsRuntime.showLevel(langId, index);
      } else {
        this.showHomePage();
      }
      return;
    }
    // 未匹配路由回首页
    this.showHomePage();
  }

  showHomePage() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none');
    const homePage = document.getElementById('homePage');
    if (homePage) {
      homePage.style.display = 'flex';
    }
    // 回到首页时复位到第一屏（hero），避免残留 picker 转场状态
    const wrapper = document.getElementById('screensWrapper');
    if (wrapper) wrapper.classList.remove('show-picker');
    this.currentScreen = 'hero';
    this.screenLock = false;
    this.cardLock = false;
  }

  navigateTo(hash) {
    window.location.hash = hash;
  }
}

// ========== 启动应用 ==========
document.addEventListener('DOMContentLoaded', () => {
  window.app = new CodeAdventurerApp();
  // app 实例挂载到 window 后再解析一次路由，确保深链（#levels/xxx）能正确进入关卡页
  window.app.handleRoute();
});

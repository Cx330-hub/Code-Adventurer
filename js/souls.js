// ========== 魂类原型关：JavaScript 魔法学院 ==========
// 流程：探索黑暗大厅 → 研读石碑习得 console.log（收入咒术栏）
//      → 用 console.log 吟唱施法 → 破解沉默结界开门
//      → 弹出「咒术解析」讲解弹窗 → 关闭后门可点击 → 点击门进入下一区域
//      施法失败 → 反噬扣血 + 方向性提示；生命归零 → 死亡重生
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);

  const HP_MAX = 3;

  const state = {
    hp: HP_MAX,
    learned: false,
    doorOpen: false,
    doorUnlocked: false,
    toastTimer: null,
  };

  const TEXT = {
    hall: '你踏入魔法学院的黑暗大厅。一扇被「沉默结界」封印的石门拦住去路，大厅中央立着一块发光的遗忘石碑。',
    learned: '石碑符文涌入脑海，你习得了咒术 console.log——它能让程序「发出声音」。去吟唱它，击碎沉默结界。',
    broken: '你喊出了心中的话语，沉默结界应声碎裂，封印之门缓缓开启。',
  };

  function setHp() {
    const el = $('soulsHp');
    if (!el) return;
    let s = '';
    for (let i = 0; i < HP_MAX; i++) s += (i < state.hp ? '♥ ' : '♡ ');
    el.textContent = s.trim();
  }

  function setSpellSlot() {
    const el = $('spellSlot');
    if (el) el.textContent = state.learned ? 'console.log' : '— 尚未习得 —';
  }

  function showToast(type, msg) {
    const t = $('soulsToast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'souls-toast ' + type;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => { t.hidden = true; }, 400);
    }, 2600);
  }

  function burst(x, y, color) {
    if (window.app && window.app.spawnClickEffect) {
      window.app.spawnClickEffect(x, y, color, true);
    }
  }

  function learnSpell() {
    if (state.learned) return;
    state.learned = true;
    setSpellSlot();
    $('soulsNarrative').textContent = TEXT.learned;
    $('stele').classList.add('learned');
    $('sealDoor').classList.add('ready');
    $('castInput').focus();
    const r = $('stele').getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, '#00f5a0');
  }

  function damage() {
    state.hp = Math.max(0, state.hp - 1);
    setHp();
    const scene = $('soulsScene');
    scene.classList.remove('damaged');
    void scene.offsetWidth; // 强制 reflow 以重放动画
    scene.classList.add('damaged');
    if (state.hp === 0) {
      showDeath();
    }
  }

  function showDeath() {
    const d = $('soulsDeath');
    d.hidden = false;
    setTimeout(() => {
      d.hidden = true;
      state.hp = HP_MAX;
      setHp();
      $('castInput').value = '';
      showToast('error', '你在篝火前苏醒，生命已恢复。');
    }, 1800);
  }

  function checkCast(code) {
    if (!/console\.log\s*\(/.test(code)) {
      return { ok: false, msg: '你吟唱的不是 console.log 咒术。回想石碑：console.log(要说的话)。' };
    }
    const m = code.match(/console\.log\s*\(\s*(['"`])([\s\S]*?)\1\s*\)/);
    if (!m || !m[2].trim()) {
      return { ok: false, msg: 'console.log 的引号里要写一句「要说的话」，不能为空。' };
    }
    return { ok: true, msg: m[2].trim() };
  }

  function cast() {
    if (!state.learned) {
      showToast('error', '你还没习得任何咒术，先研读大厅中央的石碑。');
      return;
    }
    const code = $('castInput').value;
    const r = checkCast(code);
    if (r.ok) {
      openDoor(r.msg);
    } else {
      damage();
      showToast('error', '反噬！' + r.msg);
    }
  }

  function openDoor(msg) {
    state.doorOpen = true;
    $('sealDoor').classList.remove('ready');
    $('sealDoor').classList.add('open');
    $('soulsNarrative').textContent = TEXT.broken;
    const r = $('sealDoor').getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, '#ffd700');
    setTimeout(() => { $('soulsTeach').hidden = false; }, 900);
  }

  function unlockDoor() {
    state.doorUnlocked = true;
    $('sealDoor').classList.add('unlocked');
    $('doorHint').hidden = false;
  }

  function onDoorClick() {
    if (!state.doorOpen) {
      showToast('error', '门仍被沉默结界封印，先习得咒术并施法。');
      return;
    }
    if (!state.doorUnlocked) {
      showToast('error', '先研读「咒术解析」，再决定是否踏入门扉。');
      return;
    }
    const r = $('sealDoor').getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, '#7c5cff');
    const levels = window.LEVELS && window.LEVELS.javascript;
    const next = levels && levels[1];
    if (next) {
      setTimeout(() => { if (window.app) window.app.navigateTo('#levels/javascript/2'); }, 450);
    } else {
      showToast('success', '下一区域筹备中，敬请期待。');
    }
  }

  const SoulsGame = {
    start() {
      document.querySelectorAll('.page').forEach((p) => { p.style.display = 'none'; });
      const sp = $('soulsPage');
      sp.style.display = 'flex';
      sp.style.setProperty('--soul-accent', '#7c5cff');

      state.hp = HP_MAX;
      state.learned = false;
      state.doorOpen = false;
      state.doorUnlocked = false;
      setHp();
      setSpellSlot();
      $('soulsNarrative').textContent = TEXT.hall;
      $('castInput').value = '';
      $('stele').classList.remove('learned');
      $('sealDoor').classList.remove('ready', 'open', 'unlocked');
      $('doorHint').hidden = true;
      $('soulsTeach').hidden = true;
      $('soulsDeath').hidden = true;
      $('soulsToast').hidden = true;

      if (window.app) window.app.currentScreen = 'level';
    },
    exit() {
      if (window.app) window.app.navigateTo('#');
    },
  };

  window.SoulsGame = SoulsGame;

  document.addEventListener('DOMContentLoaded', () => {
    $('soulsBackBtn').addEventListener('click', () => SoulsGame.exit());
    $('stele').addEventListener('click', learnSpell);
    $('stele').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); learnSpell(); }
      e.stopPropagation();
    });
    $('castBtn').addEventListener('click', cast);
    $('soulsHintBtn').addEventListener('click', () => {
      if (!state.learned) {
        showToast('success', '大厅中央有一块发光的石碑，去研读它。');
      } else {
        showToast('success', "咒术格式：console.log('要说的话')。把你想喊出的话写进引号里。");
      }
    });
    $('soulsTeachBtn').addEventListener('click', () => {
      $('soulsTeach').hidden = true;
      unlockDoor();
    });
    $('sealDoor').addEventListener('click', onDoorClick);
    $('sealDoor').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDoorClick(); }
      e.stopPropagation();
    });
    $('castInput').addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        cast();
      }
      e.stopPropagation();
    });
  });
})();

/* =============================================
   VAGID PORTFOLIO — script.js (v3 — enhanced)
   ============================================= */

/* ── Авторазмер заголовка ── */
function fitHeroText() {
  const container = document.querySelector('.hero-name');
  const roles = document.querySelectorAll('.name-role');
  if (!container || !roles.length) return;
  const maxWidth = container.clientWidth;
  let lo = 10, hi = 300;
  while (hi - lo > 0.5) {
    const mid = (lo + hi) / 2;
    roles.forEach(el => el.style.fontSize = mid + 'px');
    const fits = [...roles].every(el => el.scrollWidth <= maxWidth);
    if (fits) lo = mid; else hi = mid;
  }
  roles.forEach(el => el.style.fontSize = lo + 'px');
}
requestAnimationFrame(() => { fitHeroText(); document.fonts.ready.then(fitHeroText); });
window.addEventListener('resize', fitHeroText);

/* ── Кастомный курсор ── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let trailX = 0, trailY = 0;

const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches;

if (isTouchDevice) {
  if (cursor)      { cursor.style.display = 'none'; }
  if (cursorTrail) { cursorTrail.style.display = 'none'; }
} else {
  document.addEventListener('mousemove', (e) => {
    if (cursor)      { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
    if (cursorTrail) { cursorTrail.style.left = e.clientX + 'px'; cursorTrail.style.top = e.clientY + 'px'; }
  });
}

/* ── Scroll Progress Bar ── */
window.addEventListener('scroll', () => {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  bar.style.width = Math.min(pct, 100) + '%';

  // Кнопка наверх
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
});

/* ── Бургер-меню ── */
function toggleMob() {
  const menu = document.getElementById('mobMenu');
  if (menu.classList.contains('open')) {
    _genieClose(menu);
  } else {
    menu.classList.remove('closing');
    menu.classList.add('open');
    _burgerState(true);
    document.body.style.overflow = 'hidden';
  }
}

function closeMob() {
  const menu = document.getElementById('mobMenu');
  if (!menu.classList.contains('open')) return;
  _genieClose(menu);
}

function _genieClose(menu) {
  _burgerState(false);
  document.body.style.overflow = '';
  menu.querySelectorAll('a').forEach(a => {
    a.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
    a.style.opacity = '0';
    a.style.transform = 'translateY(16px) scale(0.92)';
  });
  setTimeout(() => {
    menu.classList.remove('open');
    menu.classList.add('closing');
    setTimeout(() => {
      menu.classList.remove('closing');
      menu.querySelectorAll('a').forEach(a => {
        a.style.transition = '';
        a.style.opacity = '';
        a.style.transform = '';
      });
    }, 500);
  }, 120);
}

function _burgerState(isOpen) {
  const b1 = document.getElementById('b1');
  const b2 = document.getElementById('b2');
  const b3 = document.getElementById('b3');
  if (isOpen) {
    b1.style.transform = 'rotate(45deg) translate(5px, 5px)';
    b2.style.opacity = '0';
    b2.style.transform = 'scaleX(0)';
    b3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    b1.style.transform = '';
    b2.style.opacity = '';
    b2.style.transform = '';
    b3.style.transform = '';
  }
}

/* ── Параллакс на hero-фигурах ── */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const sh1 = document.getElementById('sh1');
  const sh2 = document.getElementById('sh2');
  if (sh1) sh1.style.transform = `translateY(${y * 0.1}px)`;
  if (sh2) sh2.style.transform = `translateY(${y * -0.07}px)`;
});

/* ── Анимация счётчика ── */
function animateCounter(el, target, duration) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ── Scroll reveal ── */
setTimeout(() => {
  const items = document.querySelectorAll('.rv');

  items.forEach(el => {
    el.style.transition = 'opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)';
    el.style.opacity = '0';
    el.style.transform = 'translateY(26px)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.querySelectorAll('[data-target]').forEach(counter => {
            animateCounter(counter, parseInt(counter.dataset.target, 10), 1200);
          });
          setTimeout(() => {
            entry.target.style.transform = '';
            entry.target.style.transition = '';
          }, 700);
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(el => observer.observe(el));
}, 120);

/* ── Форма заявки ── */
const TG_TOKEN   = '8001696351:AAGlWiK1rnA0NqNtUIbTDq36ByUH6qh7IiI';
const TG_CHAT_ID = '8776878396';

const tabPlaceholders = {
  tg:    '@username или t.me/username',
  wa:    '+7 999 000 00 00',
  email: 'example@mail.com'
};
const tabLabels = { tg: 'Telegram', wa: 'WhatsApp', email: 'Email' };
let activeTab = 'tg';

document.querySelectorAll('.ctab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ctab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTab = btn.dataset.tab;
    const inp = document.getElementById('fcontact');
    if (inp) inp.placeholder = tabPlaceholders[activeTab];
  });
});

function updateTgPhoneField() {
  const wrap = document.getElementById('tg-phone-wrap');
  if (wrap) wrap.style.display = activeTab === 'tg' ? 'block' : 'none';
}

const cselect = document.getElementById('ctabSelect');
if (cselect) {
  cselect.querySelector('.cselect-val').addEventListener('click', () => cselect.classList.toggle('open'));
  cselect.querySelectorAll('.cselect-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      cselect.querySelectorAll('.cselect-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      cselect.querySelector('.cselect-val').innerHTML = opt.innerHTML;
      activeTab = opt.dataset.tab;
      const inp = document.getElementById('fcontact');
      if (inp) inp.placeholder = tabPlaceholders[activeTab];
      cselect.classList.remove('open');
      updateTgPhoneField();
    });
  });
  document.addEventListener('click', e => { if (!cselect.contains(e.target)) cselect.classList.remove('open'); });
}

document.querySelectorAll('.ctab').forEach(btn => {
  btn.addEventListener('click', () => {
    activeTab = btn.dataset.tab;
    updateTgPhoneField();
  });
});
window.addEventListener('DOMContentLoaded', updateTgPhoneField);
updateTgPhoneField();

/* ── Счётчик символов в сообщении ── */
const fmsg = document.getElementById('fmsg');
const msgCounter = document.getElementById('msgCounter');
if (fmsg && msgCounter) {
  fmsg.addEventListener('input', () => {
    const len = fmsg.value.length;
    msgCounter.textContent = `${len}/200`;
    msgCounter.classList.toggle('warn', len >= 180);
  });
  fmsg.addEventListener('keydown', (e) => {
    if (fmsg.value.length >= 200 && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      fmsg.classList.add('shake');
      fmsg.addEventListener('animationend', () => fmsg.classList.remove('shake'), { once: true });
    }
  });
}

const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = document.getElementById('fname').value.trim();
    const contact = document.getElementById('fcontact').value.trim();
    const phone   = document.getElementById('fphone') ? document.getElementById('fphone').value.trim() : '';
    const msg     = document.getElementById('fmsg').value.trim();
    const status  = document.getElementById('formStatus');
    const btn     = orderForm.querySelector('.form-btn');

    /* ── Сбор всех ошибок сразу ── */
    const errors = [];

    function emojiRatio(str) {
      if (!str) return 0;
      const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
      const emojis = (str.match(emojiRegex) || []).length;
      const words  = str.replace(emojiRegex, '').trim().length;
      return words === 0 ? 1 : emojis / (emojis + words);
    }

    /* ── Запускаем AI проверку сразу параллельно ── */
    const msgOkForAI = msg && emojiRatio(msg) <= 0.5;
    const aiPromise = msgOkForAI
      ? fetch('https://vagid-ai-checker.mamedarovvagid600.workers.dev/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        }).then(r => r.json()).catch(() => null)
      : Promise.resolve(null);

    if (name && name.length < 2)          errors.push('Имя слишком короткое — минимум 2 символа.');
    if (emojiRatio(name) > 0.5)           errors.push('Имя не должно содержать эмодзи.');
    if (!contact)                          errors.push('Укажите контакт для связи.');

    const contactValidators = {
      tg:    /^(@[\w\d_]{4,}|https?:\/\/t\.me\/[\w\d_]{4,})$/i,
      wa:    /^\+?[\d\s\-\(\)]{7,15}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    };
    if (contact && contactValidators[activeTab] && !contactValidators[activeTab].test(contact)) {
      const hints = { tg: 'Укажите @username или t.me/username', wa: 'Укажите номер телефона', email: 'Укажите корректный email' };
      errors.push(hints[activeTab]);
    }

    if (activeTab === 'tg') {
      if (!phone)                                          errors.push('Укажите номер телефона — на случай если не смогу написать в TG.');
      else if (!/^\+?[\d\s\-\(\)]{7,15}$/.test(phone))   errors.push('Введите корректный номер телефона.');
    }

    if (!msg)                         errors.push('Напишите коротко о задаче.');
    if (msg && emojiRatio(msg) > 0.5) errors.push('Сообщение не должно содержать эмодзи.');

    /* ── Ждём AI и добавляем ошибку в общий список ── */
    btn.disabled = true;
    status.textContent = 'Проверяю...';
    status.className = 'form-status';

    const aiData = await aiPromise;
    if (aiData && !aiData.ok) {
      errors.push('Сообщение некорректно, пожалуйста исправьте и попробуйте снова.');
    }

    if (errors.length > 0) {
      status.innerHTML = errors.map(e => `<span class="err-chip">${e}</span>`).join('');
      status.className = 'form-status err-wrap';
      btn.disabled = false;
      return;
    }

    status.textContent = 'Отправляю...';

    let text = '📩 Новая заявка с сайта\n';
    if (name)    text += `👤 Имя: ${name}\n`;
    text += `📌 ${tabLabels[activeTab]}: ${contact}`;
    if (phone)   text += `\n📞 Телефон: ${phone}`;
    if (msg)     text += `\n💬 Сообщение: ${msg}`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text })
      });
      const data = await res.json();
      if (data.ok) {
        status.textContent = 'Заявка отправлена! Свяжусь с вами скоро.';
        status.className = 'form-status ok';
        orderForm.reset();
        document.querySelectorAll('.ctab').forEach(b => b.classList.remove('active'));
        document.querySelector('.ctab[data-tab="tg"]').classList.add('active');
        activeTab = 'tg';
        document.getElementById('fcontact').placeholder = tabPlaceholders.tg;
      } else {
        throw new Error();
      }
    } catch {
      status.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
      status.className = 'form-status err';
    } finally {
      btn.disabled = false;
    }
  });
}

/* ── Раскрытие описания навыка по клику ── */
document.querySelectorAll('.sk').forEach(el => {
  el.addEventListener('click', () => {
    const isOpen = el.classList.contains('sk--open');
    document.querySelectorAll('.sk.sk--open').forEach(o => o.classList.remove('sk--open'));
    if (!isOpen) {
      el.classList.add('sk--open');
      if (isTouchDevice) {
        el.classList.remove('sk--bounce');
        void el.offsetWidth; // reflow для перезапуска анимации
        el.classList.add('sk--bounce');
        el.addEventListener('animationend', () => el.classList.remove('sk--bounce'), { once: true });
      }
    }
  });
});
// клик вне карточек — закрыть все
document.addEventListener('click', e => {
  if (!e.target.closest('.sk')) {
    document.querySelectorAll('.sk.sk--open').forEach(o => o.classList.remove('sk--open'));
  }
});

/* ── 3D Tilt (только pointer: fine — мышь, не тач) ── */
if (window.matchMedia('(pointer: fine)').matches) {
  function tilt3D(selector, maxTilt, liftY, sc, persp) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mousemove', e => {
        const r  = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
        const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
        const rX = (-dy * maxTilt).toFixed(2);
        const rY = ( dx * maxTilt).toFixed(2);
        el.style.transition = 'box-shadow .3s, background .25s, border-color .25s';
        el.style.transform  = `perspective(${persp}px) translateY(${liftY}px) rotateX(${rX}deg) rotateY(${rY}deg) scale(${sc})`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = '';
        el.style.transform  = '';
      });
    });
  }
  tilt3D('.sk',    14, -14, 1.07,  900);
  tilt3D('.pcard', 10, -12, 1.035, 1100);
  tilt3D('.soc',    7,  -5, 1.03,  900);
}

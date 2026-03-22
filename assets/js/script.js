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

    /* ── Фильтр: имя ── */
    if (name && name.length < 2) {
      status.textContent = 'Имя слишком короткое — минимум 2 символа.';
      status.className = 'form-status err';
      return;
    }

    /* ── Фильтр: контакт обязателен ── */
    if (!contact) {
      status.textContent = 'Укажите контакт для связи.';
      status.className = 'form-status err';
      return;
    }

    /* ── Фильтр: телефон обязателен при Telegram ── */
    if (activeTab === 'tg') {
      if (!phone) {
        status.textContent = 'Укажите номер телефона — на случай если не смогу написать в TG.';
        status.className = 'form-status err';
        return;
      }
      if (!/^\+?[\d\s\-\(\)]{7,15}$/.test(phone)) {
        status.textContent = 'Введите корректный номер телефона.';
        status.className = 'form-status err';
        return;
      }
    }

    /* ── Фильтр: валидация формата контакта ── */
    const contactValidators = {
      tg:    /^(@[\w\d_]{4,}|https?:\/\/t\.me\/[\w\d_]{4,})$/i,
      wa:    /^\+?[\d\s\-\(\)]{7,15}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    };
    if (contactValidators[activeTab] && !contactValidators[activeTab].test(contact)) {
      const hints = { tg: 'Укажите @username или t.me/username', wa: 'Укажите номер телефона', email: 'Укажите корректный email' };
      status.textContent = hints[activeTab];
      status.className = 'form-status err';
      return;
    }

    /* ── Фильтр: антиэмодзи-спам ── */
    function emojiRatio(str) {
      if (!str) return 0;
      const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
      const emojis = (str.match(emojiRegex) || []).length;
      const words  = str.replace(emojiRegex, '').trim().length;
      return words === 0 ? 1 : emojis / (emojis + words);
    }
    if (emojiRatio(msg) > 0.5 || emojiRatio(name) > 0.5) {
      status.textContent = 'Пожалуйста, напишите нормальное сообщение.';
      status.className = 'form-status err';
      return;
    }

    /* ── Сообщение обязательно ── */
    if (!msg) {
      status.textContent = 'Напишите коротко о задаче.';
      status.className = 'form-status err';
      return;
    }

    /* ── Фильтр: максимальная длина сообщения ── */
    if (msg.length > 200) {
      status.textContent = `Сообщение слишком длинное — максимум 200 символов (сейчас ${msg.length}).`;
      status.className = 'form-status err';
      return;
    }

    btn.disabled = true;
    status.textContent = 'Проверяю сообщение...';
    status.className = 'form-status';

    /* ── AI проверка через Cloudflare Worker ── */
    try {
      const aiRes = await fetch('https://vagid-ai-checker.mamedarovvagid600.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const aiData = await aiRes.json();
      if (!aiData.ok) {
        status.textContent = 'Сообщение не прошло проверку. Опишите задачу подробнее.';
        status.className = 'form-status err';
        btn.disabled = false;
        return;
      }
    } catch {
      /* если AI недоступен — пропускаем проверку */
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

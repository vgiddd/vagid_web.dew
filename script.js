/* =============================================
   VAGID PORTFOLIO — script.js
   ============================================= */

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

  // Сначала убираем ссылки
  menu.querySelectorAll('a').forEach(a => {
    a.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
    a.style.opacity = '0';
    a.style.transform = 'translateY(16px) scale(0.92)';
  });

  // Через 120мс запускаем genie закрытие
  setTimeout(() => {
    menu.classList.remove('open');
    menu.classList.add('closing');

    // После окончания анимации — чистим классы и стили
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

/* ── Scroll reveal ── */
// Запускаем через 120мс — чтобы страница сначала отрисовалась
setTimeout(() => {
  const items = document.querySelectorAll('.rv');

  // Скрываем все элементы
  items.forEach(el => {
    el.style.transition = 'opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)';
    el.style.opacity = '0';
    el.style.transform = 'translateY(26px)';
  });

  // IntersectionObserver показывает элементы при попадании в viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          // После окончания анимации убираем инлайн стили
          // чтобы CSS hover (transform, transition) снова работал
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

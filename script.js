/* ======================================================
   RAGAZZA IMOBILIÁRIA — JavaScript
   Funcionalidades: filtro de imóveis, menu mobile, header scroll
====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- MENU MOBILE ----
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('mainNav');

  hamburger.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.querySelectorAll('span').forEach((bar, i) => {
      if (isOpen) {
        if (i === 0) bar.style.transform = 'translateY(7px) rotate(45deg)';
        if (i === 1) bar.style.opacity = '0';
        if (i === 2) bar.style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bar.style.transform = '';
        bar.style.opacity = '';
      }
    });
  });

  // Fechar menu ao clicar em link
  mainNav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(bar => {
        bar.style.transform = '';
        bar.style.opacity = '';
      });
    });
  });


  // ---- HEADER: sombra ao rolar ----
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(0,0,0,.10)'
      : 'none';
  });


  // ---- FILTROS DE IMÓVEIS ----
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const cards        = document.querySelectorAll('#imoveisGrid .card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Ativa o botão clicado
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filtro = btn.dataset.filter;

      cards.forEach(card => {
        if (filtro === 'todos') {
          card.classList.remove('hidden');
          return;
        }
        // Checa tipo OU negócio
        const tipo    = card.dataset.tipo    || '';
        const negocio = card.dataset.negocio || '';

        if (tipo === filtro || negocio === filtro) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      // Mostra aviso se nenhum resultado
      const visiveis = [...cards].filter(c => !c.classList.contains('hidden'));
      let aviso = document.getElementById('semResultados');

      if (visiveis.length === 0) {
        if (!aviso) {
          aviso = document.createElement('p');
          aviso.id = 'semResultados';
          aviso.textContent = 'Nenhum imóvel encontrado nesta categoria no momento.';
          aviso.style.cssText = 'text-align:center;color:#6B6460;padding:32px 0;font-size:.95rem;grid-column:1/-1';
          document.getElementById('imoveisGrid').appendChild(aviso);
        }
      } else if (aviso) {
        aviso.remove();
      }
    });
  });


  // ---- ANIMAÇÃO DE ENTRADA DOS CARDS (Intersection Observer) ----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Aplica animação inicial
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity .4s ease ${index * 0.08}s, transform .4s ease ${index * 0.08}s, box-shadow .25s ease`;
    observer.observe(card);
  });


  // ---- SCROLL SUAVE PARA ÂNCORAS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});

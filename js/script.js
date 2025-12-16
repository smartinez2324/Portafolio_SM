// ===== Scroll animations (fade in) =====
const faders = document.querySelectorAll('.fade-left, .fade-right, .fade-up, .fade-in');
const appearObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

faders.forEach(f => appearObserver.observe(f));

// ===== Header (scroll shrink) =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));

// ===== Mobile menu toggle =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
menuToggle && menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  menuToggle.classList.toggle('active');
});

// ===== Dark mode toggles =====
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');

function setDarkMode(on){
  document.body.classList.toggle('dark-mode', on);
  localStorage.setItem('dark-mode', on ? '1' : '0');
}
if (localStorage.getItem('dark-mode') === '1') setDarkMode(true);

if (darkModeToggle) darkModeToggle.addEventListener('click', ()=> setDarkMode(!document.body.classList.contains('dark-mode')));
if (darkModeToggleMobile) darkModeToggleMobile.addEventListener('click', ()=> setDarkMode(!document.body.classList.contains('dark-mode')));

// ===== Tabs (categorías) =====
const tabs = document.querySelectorAll('.tab');
const projectCards = document.querySelectorAll('.project-card');

function showTab(cat){
  projectCards.forEach(card => {
    const matches = cat === 'all' || card.dataset.category === cat;
    card.style.display = matches ? 'block' : 'none';
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const category = tab.dataset.tab;
    showTab(category);
  });
});

// inicial
showTab('all');

// ===== Modal + carousel =====
const modal = document.getElementById('projectModal');
const modalContent = modal.querySelector('.modal-content');
const modalClose = modal.querySelector('.modal-close');
const carouselTrack = modal.querySelector('.carousel-track');
const prevBtn = modal.querySelector('.prev-btn');
const nextBtn = modal.querySelector('.next-btn');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalLink = document.getElementById('modalLink');

let currentImages = [];
let currentIndex = 0;

function openModalFromCard(card){
  const title = card.dataset.title || card.querySelector('h3')?.innerText || '';
  const desc = card.dataset.desc || '';
  let images = [];
  try { images = JSON.parse(card.dataset.images || '[]'); } catch(e){ images = []; }

  if (images.length === 0) {
    const src = card.querySelector('img')?.src;
    if (src) images = [src];
  }

  currentImages = images;
  currentIndex = 0;
  renderCarousel();
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
 // enlace del proyecto (si no hay, se oculta el botón)
if (card.dataset.link) {
  modalLink.href = card.dataset.link;
  modalLink.style.display = 'inline-block';
} else {
  modalLink.href = '#';
  modalLink.style.display = 'none';
}

  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // animación de entrada
  const modalBox = modal.querySelector('.modal-content');
  modalBox.classList.remove('animate-in');
  void modalBox.offsetWidth; // reinicia animación
  modalBox.classList.add('animate-in');
}


function renderCarousel(){
  carouselTrack.innerHTML = currentImages.map((src, i) => `<img src="${src}" alt="${i+1}" class="${i===currentIndex ? 'active' : ''}">`).join('');
  // asegurar que el active img esté visible (no translate, usamos opacity fade)
}

projectCards.forEach(card => {
  card.addEventListener('click', () => openModalFromCard(card));
});

// Prev / Next
prevBtn && prevBtn.addEventListener('click', () => {
  if (!currentImages.length) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  fadeToIndex(currentIndex);
});
nextBtn && nextBtn.addEventListener('click', () => {
  if (!currentImages.length) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  fadeToIndex(currentIndex);
});

function fadeToIndex(idx){
  const imgs = carouselTrack.querySelectorAll('img');
  imgs.forEach((img,i)=> img.classList.toggle('active', i===idx));
}

// close modal
modalClose.addEventListener('click', closeModal);
window.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});
function closeModal(){
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}


// === Animación al entrar a la web ===
window.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('section, header, footer');
  elements.forEach(el => {
    el.classList.add('fade-enter');
    setTimeout(() => el.classList.add('show'), 100);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('projectModal');
  if (modal) modal.style.display = 'none';
});


// Animación al hacer scroll sobre mi
const animatedItems = document.querySelectorAll('.fade-in-up');

function handleScrollAnimation() {
  animatedItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      item.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);

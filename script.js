// --- SCROLL ANIMATIONS ---
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

// --- MODAL GALERIE avec SLIDER ---
const modal = document.getElementById('galleryModal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalDots = document.getElementById('modalDots');

let galleryImages = [];
let currentIndex = 0;

function getVisibleImages() {
    return Array.from(document.querySelectorAll('.gallery-img')).filter(
        img => img.offsetParent !== null
    );
}

function buildDots() {
    modalDots.innerHTML = '';
    galleryImages.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'modal-dot' + (i === currentIndex ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        modalDots.appendChild(dot);
    });
}

function updateModal(animate) {
    const img = galleryImages[currentIndex];
    const hasMultiple = galleryImages.length > 1;

    if (animate) {
        modalImg.style.opacity = '0';
        setTimeout(() => {
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalImg.style.opacity = '1';
        }, 150);
    } else {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
    }

    // Sync dots
    document.querySelectorAll('.modal-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });

    modalPrev.style.display = hasMultiple ? 'flex' : 'none';
    modalNext.style.display = hasMultiple ? 'flex' : 'none';
    modalDots.style.display = hasMultiple ? 'flex' : 'none';
}

function openModal(index) {
    galleryImages = getVisibleImages();
    currentIndex = index;
    buildDots();
    updateModal(false);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function goTo(index) {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    updateModal(true);
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { modalImg.src = ''; }, 300);
}

// Attacher le clic à toutes les images de la galerie (y compris celles chargées après)
document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
        const visible = getVisibleImages();
        const idx = visible.indexOf(img);
        openModal(idx !== -1 ? idx : 0);
    });
});

modalClose.addEventListener('click', closeModal);
modalPrev.addEventListener('click', (e) => { e.stopPropagation(); goTo(currentIndex - 1); });
modalNext.addEventListener('click', (e) => { e.stopPropagation(); goTo(currentIndex + 1); });

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
});



// --- TOGGLE MAINS / PIEDS ---
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const tabToggle = document.getElementById('tabToggle');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        tabToggle.dataset.active = target;
        document.getElementById('tab-' + target).classList.add('active');
    });
});

// --- GALERIE : VOIR PLUS ---
const btnVoirPlus = document.getElementById('btnVoirPlus');
const photoGridExtra = document.getElementById('photoGridExtra');

if (btnVoirPlus && photoGridExtra) {
    btnVoirPlus.addEventListener('click', () => {
        photoGridExtra.style.display = 'grid';
        // Force reflow so CSS animations trigger
        void photoGridExtra.offsetWidth;
        photoGridExtra.classList.add('open');
        btnVoirPlus.closest('.voir-plus-wrapper').style.display = 'none';
    });
}

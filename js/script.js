document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.2,
    };

    const animatedItems = document.querySelectorAll('[data-animate]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('fade-in-up');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    animatedItems.forEach((item, index) => {
        item.classList.add('opacity-0');
        item.style.animationDelay = `${index * 120}ms`;
        revealObserver.observe(item);
    });

    const projectCards = Array.from(document.querySelectorAll('.project-card'));
    const lightbox = document.getElementById('project-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const slideCounter = document.getElementById('slide-counter');

    const slideshowImages = {
        web: [
            'assets/web.png',
            'assets/web1.png',
            'assets/web2.png'
        ],
        poster: [
            'assets/poster.jpeg',
            'assets/poster1.jpeg',
            'assets/poster2.jpeg',
            'assets/poster3.jpeg',
            'assets/poster4.jpeg',
            'assets/poster5.jpeg',
            'assets/poster6.jpeg',
            'assets/poster7.jpeg'
        ]
    };

    let currentSlideshow = [];
    let currentSlideIndex = 0;

    const updateLightboxImage = () => {
        if (!currentSlideshow.length) return;
        const src = currentSlideshow[currentSlideIndex];
        lightboxImage.classList.remove('fade-in', 'fade-out', 'slide-in-right', 'slide-in-left');
        lightboxImage.src = src;
        lightboxImage.alt = `Slide ${currentSlideIndex + 1}`;
        slideCounter.textContent = `${currentSlideIndex + 1} / ${currentSlideshow.length}`;
        setTimeout(() => lightboxImage.classList.add('fade-in'), 20);
    };

    const openLightbox = (index) => {
        if (!lightbox || projectCards.length === 0) return;
        const card = projectCards[index];
        if (!card) return;

        const slideshowKey = card.dataset.slideshow || 'web';
        currentSlideshow = slideshowImages[slideshowKey] || [card.dataset.fullsrc || card.querySelector('.project-image')?.dataset.fullsrc];
        currentSlideIndex = 0;

        lightboxImage.classList.add('w-full', 'h-auto', 'max-h-[85vh]', 'object-contain', 'rounded-lg');
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        updateLightboxImage();
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
    };

    projectCards.forEach((card, index) => {
        card.addEventListener('click', (event) => {
            if (event.target.closest('a')) return;
            openLightbox(index);
        });
    });

    lightbox?.addEventListener('click', (event) => {
        if (event.target === lightbox || event.target.id === 'lightbox-close') {
            closeLightbox();
        }
    });

    lightboxPrev?.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!currentSlideshow.length) return;
        currentSlideIndex = (currentSlideIndex - 1 + currentSlideshow.length) % currentSlideshow.length;
        updateLightboxImage();
    });

    lightboxNext?.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!currentSlideshow.length) return;
        currentSlideIndex = (currentSlideIndex + 1) % currentSlideshow.length;
        updateLightboxImage();
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox || lightbox.classList.contains('hidden')) return;
        if (event.key === 'ArrowLeft') {
            currentSlideIndex = (currentSlideIndex - 1 + currentSlideshow.length) % currentSlideshow.length;
            updateLightboxImage();
        }
        if (event.key === 'ArrowRight') {
            currentSlideIndex = (currentSlideIndex + 1) % currentSlideshow.length;
            updateLightboxImage();
        }
        if (event.key === 'Escape') closeLightbox();
    });
});

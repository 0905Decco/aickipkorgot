// Giving Carousel JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('givingCarousel');
  const slides = document.querySelectorAll('.giving-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  let currentSlide = 0;
  let autoPlayInterval;
  const autoPlayDelay = 5000; // 5 seconds

  // Initialize carousel
  function initCarousel() {
    if (!carousel || !slides.length) return;
    
    // Set initial slide
    showSlide(currentSlide);
    
    // Start autoplay
    startAutoPlay();
    
    // Add event listeners
    setupEventListeners();
  }

  // Show specific slide
  function showSlide(slideIndex) {
    // Hide all slides
    slides.forEach((slide, index) => {
      slide.classList.remove('active');
      if (index === slideIndex) {
        slide.classList.add('active');
      }
    });

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.remove('active');
      if (index === slideIndex) {
        dot.classList.add('active');
      }
    });

    currentSlide = slideIndex;
  }

  // Go to next slide
  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  // Go to previous slide
  function prevSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  // Start autoplay
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  }

  // Stop autoplay
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Navigation buttons
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
      });
    }

    // Dots navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        stopAutoPlay();
        startAutoPlay();
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;

      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          // Swipe right - previous slide
          prevSlide();
        } else {
          // Swipe left - next slide
          nextSlide();
        }
        stopAutoPlay();
        startAutoPlay();
      }
    }

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Pause autoplay when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });
  }

  // Initialize carousel when DOM is loaded
  initCarousel();

  // Responsive adjustments
  function handleResize() {
    // Adjust carousel for mobile
    if (window.innerWidth <= 768) {
      carousel.classList.add('mobile');
    } else {
      carousel.classList.remove('mobile');
    }
  }

  // Handle window resize
  window.addEventListener('resize', handleResize);
  handleResize(); // Initial call
});

// Export for potential use in other scripts
window.GivingCarousel = {
  init: function() {
    // Re-initialize if needed
    document.dispatchEvent(new Event('DOMContentLoaded'));
  }
};

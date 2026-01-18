/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox for gallery
    if (window.SimpleLightbox) {
      new SimpleLightbox({ elements: '#gallery .gallery-item' });
    }

});

// Enhanced generic slider function with auto-play and side slides
function setupSlider(wrapperSelector, slideSelector, prevBtnId, nextBtnId, auto = true, interval = 3500) {
  const slides = document.querySelectorAll(slideSelector);
  if (!slides.length) return;
  let current = 0, timer = null;

  function updateSlides() {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'left', 'right');
      if (idx === current) {
        slide.classList.add('active');
      } else if (idx === (current - 1 + slides.length) % slides.length) {
        slide.classList.add('left');
      } else if (idx === (current + 1) % slides.length) {
        slide.classList.add('right');
      }
    });
  }

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    updateSlides();
  }

  document.getElementById(prevBtnId).onclick = function() {
    goTo(current - 1);
    resetAuto();
  };
  document.getElementById(nextBtnId).onclick = function() {
    goTo(current + 1);
    resetAuto();
  };

  function autoPlay() {
    goTo(current + 1);
  }
  function resetAuto() {
    if (auto && timer) {
      clearInterval(timer);
      timer = setInterval(autoPlay, interval);
    }
  }

  updateSlides();
  if (auto) {
    timer = setInterval(autoPlay, interval);
    // Pause on hover
    const wrapper = document.querySelector(wrapperSelector);
    wrapper.addEventListener('mouseenter', () => clearInterval(timer));
    wrapper.addEventListener('mouseleave', () => { timer = setInterval(autoPlay, interval); });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setupSlider('.services-slider-wrapper', '.service-slide', 'servicePrev', 'serviceNext', true, 3500);
  setupSlider('.sermons-slider-wrapper', '.sermon-slide', 'sermonPrev', 'sermonNext', true, 3500);
});

/* Enhanced: ensure one dot per slide and section styling sync for ministries carousel */
(function initMinistryCarousel() {
  const car = document.querySelector('.ministry-carousel');
  if (!car) return;

  const slidesWrap = car.querySelector('.slides');
  const slides = Array.from(car.querySelectorAll('.slide'));
  let dotsWrap = car.querySelector('.dots');

  // If no dots container present, create one and append
  if (!dotsWrap) {
    dotsWrap = document.createElement('div');
    dotsWrap.className = 'dots';
    dotsWrap.setAttribute('role', 'tablist');
    car.appendChild(dotsWrap);
  }

  // Rebuild dots to exactly match slides count (one dot per slide)
  function buildDots() {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Ministry ${i + 1}`);
      btn.setAttribute('data-slide', String(i));
      btn.addEventListener('click', () => moveTo(i, true));
      dotsWrap.appendChild(btn);
    });
    return Array.from(dotsWrap.children);
  }

  const dots = buildDots();
  let idx = 0;
  let width = car.clientWidth;
  let touchStartX = 0, touchDeltaX = 0, isTouch = false;
  const total = slides.length;

  function updateSize() {
    width = car.clientWidth;
    slides.forEach(s => s.style.width = `${width}px`);
    moveTo(idx, false);
  }

  function moveTo(i, animate = true) {
    idx = (i + total) % total;
    const x = -idx * width;
    slidesWrap.style.transition = animate ? 'transform 0.6s ease-in-out' : 'none';
    slidesWrap.style.transform = `translateX(${x}px)`;
    slides.forEach((s, j) => s.classList.toggle('active', j === idx));
    // refresh dots to reflect active slide
    Array.from(dotsWrap.children).forEach((d, j) => d.classList.toggle('active', j === idx));
    if (!animate) requestAnimationFrame(() => { slidesWrap.style.transition = ''; });
  }

  function next() { moveTo(idx + 1, true); }

  // touch/swipe handlers
  slidesWrap.addEventListener('touchstart', (e) => {
    isTouch = true;
    touchStartX = e.touches[0].clientX;
    slidesWrap.style.transition = 'none';
  }, { passive: true });

  slidesWrap.addEventListener('touchmove', (e) => {
    if (!isTouch) return;
    touchDeltaX = e.touches[0].clientX - touchStartX;
    slidesWrap.style.transform = `translateX(${ -idx*width + touchDeltaX }px)`;
  }, { passive: true });

  slidesWrap.addEventListener('touchend', () => {
    if (!isTouch) return;
    isTouch = false;
    if (Math.abs(touchDeltaX) > Math.max(40, width * 0.12)) {
      if (touchDeltaX < 0) moveTo(idx + 1); else moveTo(idx - 1);
    } else {
      moveTo(idx, true);
    }
    touchDeltaX = 0;
  });

  // keyboard support
  car.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveTo(idx - 1);
    if (e.key === 'ArrowRight') moveTo(idx + 1);
  });

  // autoplay with pause on hover/focus
  let auto = setInterval(next, 3000);
  car.addEventListener('mouseenter', () => clearInterval(auto));
  car.addEventListener('mouseleave', () => { auto = setInterval(next, 3000); });
  car.addEventListener('focusin', () => clearInterval(auto));
  car.addEventListener('focusout', () => { auto = setInterval(next, 3000); });

  window.addEventListener('resize', updateSize);
  updateSize();

})();

/* Robust animated rotate groups for ministries (appear → disappear → next group)
   - Falls back to inline data if .ministries-source is missing
   - Creates .ministry-stage if not present
   - Logs errors to console for quick debugging
*/
(function animatedMinistries() {
  // Build modern ministries from source into .ministries-modern
  const modern = document.querySelector('.ministries-modern');
  if (!modern) return;

  const source = document.querySelector('.ministries-source');
  // fallback data if source not present or empty
  const fallback = [
    { title: 'Youth Ministry', text: 'Empowering young people through fellowship, mentorship, and spiritual growth.' },
    { title: 'Sunday School', text: 'Teaching children the Word of God in a fun, engaging, and interactive way.' },
    { title: 'Women Fellowship', text: 'Encouraging women to grow in faith, support one another, and serve the church community.' },
    { title: 'Men Fellowship', text: 'Building strong men of faith through discipleship, prayer, and leadership training.' },
    { title: 'Choir', text: 'Leading the congregation in praise and worship with uplifting music and song.' },
    { title: 'Mission Department', text: 'Reaching out to the community and beyond with the message of Christ’s love.' }
  ];

  // obtain data: from source children if present; else fallback
  let items = [];
  if (source && source.children.length) {
    items = Array.from(source.children).map(node => ({
      title: (node.querySelector('h5')?.textContent || '').trim(),
      text: (node.querySelector('p')?.textContent || '').trim()
    }));
  } else {
    items = fallback;
  }

  // icon map (bootstrap icons)
  const iconByTitle = {
    'Youth Ministry': 'bi-people-fill',
    'Sunday School': 'bi-book',
    'Women Fellowship': 'bi-heart',
    'Men Fellowship': 'bi-shield-check',
    'Choir': 'bi-music-note-beamed',
    'Mission Department': 'bi-geo-alt'
  };

  // build base pool of cards
  const pool = items.map(item => {
    const card = document.createElement('div');
    card.className = 'ministry-card';
    const icn = document.createElement('div'); icn.className = 'icn';
    const i = document.createElement('i'); i.className = `bi ${iconByTitle[item.title] || 'bi-star'}`; icn.appendChild(i);
    const h = document.createElement('h6'); h.textContent = item.title;
    const p = document.createElement('p'); p.textContent = item.text;
    card.appendChild(icn); card.appendChild(h); card.appendChild(p);
    return card;
  });

  // animated mode: show 2 cards at a time, auto-cycle
  function computeGroupSize() { return window.innerWidth <= 575 ? 1 : 2; }
  let groupSize = computeGroupSize();
  let index = 0;
  let timer = null;

  function render(animate = true) {
    const size = computeGroupSize();
    if (size !== groupSize) { groupSize = size; index = 0; }
    modern.innerHTML = '';
    const slice = [];
    for (let j = 0; j < groupSize; j++) {
      slice.push(pool[(index + j) % pool.length].cloneNode(true));
    }
    slice.forEach(node => modern.appendChild(node));
    // trigger animation
    requestAnimationFrame(() => {
      modern.querySelectorAll('.ministry-card').forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), i * 80);
      });
    });
  }

  function next() {
    index = (index + groupSize) % pool.length;
    render(true);
  }

  function start() {
    clearInterval(timer);
    render(false);
    timer = setInterval(next, 3500);
  }

  // pause on hover/focus
  modern.addEventListener('mouseenter', () => clearInterval(timer));
  modern.addEventListener('mouseleave', () => { timer = setInterval(next, 3500); });
  modern.addEventListener('focusin', () => clearInterval(timer));
  modern.addEventListener('focusout', () => { timer = setInterval(next, 3500); });

  window.addEventListener('resize', () => {
    const newSize = computeGroupSize();
    if (newSize !== groupSize) { groupSize = newSize; index = 0; render(false); }
  });

  start();
})();

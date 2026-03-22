/**
 * Image Carousel Component
 * - Multi-image grid view (3 desktop, 2 tablet, 1 mobile)
 * - Page-based navigation with arrows and dots
 * - Responsive items per view
 * - Swipe support on mobile
 */
(function () {
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var allSlides = Array.from(track.children);
    var prevBtn = carousel.querySelector('.carousel-prev');
    var nextBtn = carousel.querySelector('.carousel-next');
    var dotsContainer = carousel.querySelector('.carousel-dots');
    var emptyMsg = carousel.querySelector('.carousel-empty');
    var currentPage = 0;
    var itemsPerView = 3;
    var startX = 0;
    var isDragging = false;

    if (allSlides.length === 0) {
      if (emptyMsg) emptyMsg.style.display = '';
      return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';

    function getItemsPerView() {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function totalPages() {
      return Math.ceil(allSlides.length / itemsPerView);
    }

    function render() {
      var start = currentPage * itemsPerView;
      allSlides.forEach(function (slide, i) {
        slide.style.display = (i >= start && i < start + itemsPerView) ? '' : 'none';
      });
      renderDots();
    }

    function renderDots() {
      dotsContainer.innerHTML = '';
      var pages = totalPages();
      for (var i = 0; i < pages; i++) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
        dot.setAttribute('aria-label', 'Puslapis ' + (i + 1));
        (function (idx) {
          dot.addEventListener('click', function () {
            currentPage = idx;
            render();
          });
        })(i);
        dotsContainer.appendChild(dot);
      }
    }

    function next() {
      currentPage = (currentPage + 1) % totalPages();
      render();
    }

    function prev() {
      currentPage = (currentPage - 1 + totalPages()) % totalPages();
      render();
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Keyboard
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    // Swipe support
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      isDragging = false;
      var diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) next(); else prev();
      }
    });

    // Mouse drag support
    track.addEventListener('mousedown', function (e) {
      startX = e.clientX;
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener('mouseup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      var diff = e.clientX - startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) next(); else prev();
      }
    });

    // Prevent image drag
    track.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('dragstart', function (e) { e.preventDefault(); });
    });

    // Responsive: recalculate on resize
    window.addEventListener('resize', function () {
      var newPerView = getItemsPerView();
      if (newPerView !== itemsPerView) {
        itemsPerView = newPerView;
        if (currentPage >= totalPages()) currentPage = 0;
        render();
      }
    });

    itemsPerView = getItemsPerView();
    render();
  });
})();

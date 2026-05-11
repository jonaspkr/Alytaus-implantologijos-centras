(function () {
  // Paslaugos mega dropdown — hover open/close with delay
  var dropdown = document.querySelector('.nav-dropdown');
  var mega = dropdown ? dropdown.querySelector('.dropdown-mega') : null;

  if (dropdown && mega) {
    var closeTimer = null;
    var DELAY = 250;

    function open() {
      clearTimeout(closeTimer);
      dropdown.classList.add('open');
    }

    function scheduleClose() {
      closeTimer = setTimeout(function () {
        dropdown.classList.remove('open');
      }, DELAY);
    }

    dropdown.addEventListener('mouseenter', open);
    dropdown.addEventListener('mouseleave', scheduleClose);
    mega.addEventListener('mouseenter', open);
    mega.addEventListener('mouseleave', scheduleClose);
  }

  // Mobile hamburger — sync aria-expanded with .open class for screen readers
  var toggle = document.querySelector('.nav-toggle');
  var navbar = document.getElementById('navbar');
  if (toggle && navbar) {
    toggle.addEventListener('click', function () {
      var isOpen = navbar.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
})();

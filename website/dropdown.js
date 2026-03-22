(function () {
  var dropdown = document.querySelector('.nav-dropdown');
  var mega = dropdown ? dropdown.querySelector('.dropdown-mega') : null;
  if (!dropdown || !mega) return;

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
})();

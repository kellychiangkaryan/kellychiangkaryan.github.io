// Shared behaviour: mobile menu, active link, project filter, footer year.
(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var list = document.querySelector('.nav ul');
  if (btn && list) {
    btn.addEventListener('click', function () {
      var open = list.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Highlight current page in nav
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a.link').forEach(function (a) {
    if (a.getAttribute('href') === here) a.classList.add('active');
  });

  // Project filter (Projects page): buttons use data-filter, cards use data-cats
  var buttons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('[data-cats]');
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      buttons.forEach(function (x) { x.classList.toggle('active', x === b); });
      cards.forEach(function (c) {
        var cats = c.getAttribute('data-cats').split(' ');
        c.classList.toggle('hidden', f !== 'all' && cats.indexOf(f) === -1);
      });
    });
  });

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

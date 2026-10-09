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

  // Image lightbox: links to images open in an overlay instead of a new tab
  var imgLinks = Array.prototype.slice.call(
    document.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".svg"], a[href$=".gif"], a[href$=".webp"]')
  );
  if (imgLinks.length) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.hidden = true;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image viewer');
    box.innerHTML =
      '<button type="button" class="lb-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lb-nav lb-prev" aria-label="Previous image">&#8249;</button>' +
      '<figure class="lb-figure"><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-nav lb-next" aria-label="Next image">&#8250;</button>';
    document.body.appendChild(box);

    var lbImg = box.querySelector('img');
    var lbCap = box.querySelector('figcaption');
    var prevBtn = box.querySelector('.lb-prev');
    var nextBtn = box.querySelector('.lb-next');
    var current = -1;
    var lastFocus = null;

    function captionFor(a) {
      var fig = a.closest('figure');
      var cap = fig && fig.querySelector('figcaption');
      var tag = a.querySelector('.tag-label');
      var text = cap ? cap.textContent.trim() : '';
      if (!text) {
        var img = a.querySelector('img');
        text = img ? img.alt : '';
      }
      return (tag ? tag.textContent.trim() + ': ' : '') + text;
    }

    function show(i) {
      current = (i + imgLinks.length) % imgLinks.length;
      var a = imgLinks[current];
      var thumb = a.querySelector('img');
      lbImg.src = a.getAttribute('href');
      lbImg.alt = thumb ? thumb.alt : '';
      lbCap.textContent = captionFor(a);
      lbCap.hidden = !lbCap.textContent;
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      var many = imgLinks.length > 1;
      prevBtn.hidden = !many;
      nextBtn.hidden = !many;
      box.hidden = false;
      document.body.classList.add('lb-open');
      box.querySelector('.lb-close').focus();
    }

    function close() {
      box.hidden = true;
      lbImg.removeAttribute('src');
      document.body.classList.remove('lb-open');
      if (lastFocus) lastFocus.focus();
    }

    imgLinks.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return; // keep "open in new tab"
        e.preventDefault();
        open(i);
      });
    });

    box.querySelector('.lb-close').addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(current - 1); });
    nextBtn.addEventListener('click', function () { show(current + 1); });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lb-figure')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft' && imgLinks.length > 1) show(current - 1);
      else if (e.key === 'ArrowRight' && imgLinks.length > 1) show(current + 1);
    });
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

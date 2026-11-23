// Adam Sarabia — small site scripts (no libraries needed)

// Mobile menu toggle
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (!header || !toggle) return;
  toggle.addEventListener('click', function () {
    var open = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Footer year
(function () {
  var el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// NSFW cover: any link with class="nsfw" starts blurred with an "NSFW · Click to show"
// label. One click reveals it. Once the mouse has been off the picture for
// NSFW_REBLUR_MS, it blurs again.
var NSFW_REBLUR_MS = 2000;
var CAN_HOVER = window.matchMedia && window.matchMedia('(hover: hover)').matches;

function nsfwStillViewed(el) {
  try { return el.matches(':hover') || el.matches(':focus-visible'); }
  catch (e) { return el.matches(':hover'); }
}

(function () {
  var items = document.querySelectorAll('a.nsfw');
  Array.prototype.forEach.call(items, function (link) {
    var cover = document.createElement('span');
    cover.className = 'nsfw-cover';
    cover.innerHTML = '<span class="nsfw-tag">NSFW</span><span class="nsfw-hint">Click to show</span>';
    link.appendChild(cover);

    var timer = null;
    function scheduleReblur() {
      clearTimeout(timer);
      if (!CAN_HOVER || !link.classList.contains('revealed')) return;
      timer = setTimeout(function () {
        if (nsfwStillViewed(link)) return;   // still looking: wait for the next mouseleave/blur
        link.classList.remove('revealed');
      }, NSFW_REBLUR_MS);
    }

    link.addEventListener('click', function (e) {
      if (link.classList.contains('revealed')) return;
      e.preventDefault();
      e.stopImmediatePropagation();   // don't open the viewer on the reveal click
      link.classList.add('revealed');
    });
    link.addEventListener('mouseenter', function () { clearTimeout(timer); });
    link.addEventListener('mouseleave', scheduleReblur);
    link.addEventListener('blur', scheduleReblur);
  });
})();

// Lightbox: any link with data-lightbox="group-name" opens its href full screen.
// Links sharing the same group can be stepped through with the arrows or keyboard.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]'));
  if (!links.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Image viewer');
  box.innerHTML =
    '<img alt="">' +
    '<button class="lb-close" type="button" aria-label="Close">&times;</button>' +
    '<button class="lb-prev" type="button" aria-label="Previous image">&#8249;</button>' +
    '<button class="lb-next" type="button" aria-label="Next image">&#8250;</button>' +
    '<button class="lb-reveal" type="button"><span class="nsfw-tag">NSFW</span>Click to show</button>' +
    '<div class="lb-count" aria-live="polite"></div>';
  document.body.appendChild(box);

  var img = box.querySelector('img');
  var revealBtn = box.querySelector('.lb-reveal');
  var count = box.querySelector('.lb-count');
  var prevBtn = box.querySelector('.lb-prev');
  var nextBtn = box.querySelector('.lb-next');
  var group = [];
  var index = 0;
  var lastFocus = null;

  function show(i) {
    index = (i + group.length) % group.length;
    var link = group[index];
    var thumb = link.querySelector('img');
    img.src = link.getAttribute('href');
    img.alt = thumb ? thumb.alt : '';
    count.textContent = group.length > 1 ? (index + 1) + ' / ' + group.length : '';
    prevBtn.style.display = nextBtn.style.display = group.length > 1 ? '' : 'none';
    // Arrowing onto a hidden NSFW piece keeps it blurred until it's clicked.
    box.classList.toggle('lb-blur', link.classList.contains('nsfw') && !link.classList.contains('revealed'));
    scheduleLbReblur();
  }

  function reveal() {
    group[index].classList.add('revealed');
    box.classList.remove('lb-blur');
    scheduleLbReblur();
  }

  // A revealed NSFW piece blurs again once the mouse has been off it for NSFW_REBLUR_MS.
  var lbTimer = null;
  function scheduleLbReblur() {
    clearTimeout(lbTimer);
    var link = group[index];
    if (!CAN_HOVER || !box.classList.contains('open') || !link || !link.classList.contains('nsfw') || box.classList.contains('lb-blur')) return;
    lbTimer = setTimeout(function () {
      if (img.matches(':hover')) return;   // still looking: wait for the next mouseleave
      link.classList.remove('revealed');
      box.classList.add('lb-blur');
    }, NSFW_REBLUR_MS);
  }
  img.addEventListener('mouseenter', function () { clearTimeout(lbTimer); });
  img.addEventListener('mouseleave', scheduleLbReblur);

  function open(link) {
    var name = link.getAttribute('data-lightbox');
    group = links.filter(function (l) { return l.getAttribute('data-lightbox') === name; });
    lastFocus = document.activeElement;
    box.classList.add('open');
    show(group.indexOf(link));
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }

  function close() {
    clearTimeout(lbTimer);
    box.classList.remove('open');
    document.body.style.overflow = '';
    img.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      open(link);
    });
  });

  box.querySelector('.lb-close').addEventListener('click', close);
  revealBtn.addEventListener('click', reveal);
  img.addEventListener('click', function () { if (box.classList.contains('lb-blur')) reveal(); });
  prevBtn.addEventListener('click', function () { show(index - 1); });
  nextBtn.addEventListener('click', function () { show(index + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
  });
})();

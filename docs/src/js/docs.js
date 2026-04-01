/*! Strand Docs | MIT License | dillingerstaffing.com */

(function () {
  'use strict';

  // ── Copy to Clipboard ──
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.docs-copy-btn');
    if (!btn) return;

    var block = btn.closest('.docs-code-block');
    if (!block) return;

    var code = block.querySelector('code');
    if (!code) return;

    var text = code.textContent;
    navigator.clipboard.writeText(text).then(function () {
      var original = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(function () {
        btn.textContent = original;
      }, 1500);
    });
  });

  // ── Mobile Nav Toggle ──
  var toggle = document.querySelector('.docs-mobile-toggle');
  var sidebar = document.querySelector('.docs-sidebar');

  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('is-open');
      var expanded = sidebar.classList.contains('is-open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    // Close sidebar on content click (mobile)
    var content = document.querySelector('.docs-content');
    if (content) {
      content.addEventListener('click', function () {
        sidebar.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }
})();

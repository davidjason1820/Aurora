/* ==========================================================================
   theme.js — cart drawer, mobile nav, AJAX add-to-cart, variant switching
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.querySelector('.header__nav-toggle');
  const nav = document.querySelector('.header__nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Cart drawer ---------- */
  const drawer = document.getElementById('CartDrawer');
  const drawerToggle = document.getElementById('CartDrawerToggle');

  function openDrawer(e) {
    if (e) e.preventDefault();
    if (!drawer) return;
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.hidden = true;
    document.body.style.overflow = '';
  }
  if (drawerToggle && drawer) {
    drawerToggle.addEventListener('click', openDrawer);
    drawer.querySelectorAll('[data-cart-drawer-close]').forEach((el) =>
      el.addEventListener('click', closeDrawer)
    );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.hidden) closeDrawer();
    });
  }

  /* ---------- Helpers ---------- */
  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach((el) => (el.textContent = count));
  }

  function refreshCartContents() {
    return fetch(window.theme.routes.cart_url + '.js')
      .then((r) => r.json())
      .then((cart) => {
        updateCartCount(cart.item_count);
        const subtotal = document.querySelector('[data-cart-drawer-subtotal]');
        if (subtotal && cart.items.length >= 0) {
          window.location.reload(); // simple strategy: reload to re-render items server-side
        }
      })
      .catch(() => window.location.reload());
  }

  /* ---------- AJAX remove from cart/drawer ---------- */
  document.addEventListener('click', (e) => {
    const removeLink = e.target.closest('[data-cart-remove]');
    if (!removeLink) return;
    e.preventDefault();
    fetch(removeLink.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({})
    })
      .then((r) => r.json())
      .then(() => window.location.reload())
      .catch(() => window.location.reload());
  });

  /* ---------- AJAX add to cart ---------- */
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', function (e) {
      // Let dynamic checkout / sold-out submissions proceed normally
      if (e.submitter && e.submitter.name === 'checkout') return;
      const submitBtn = productForm.querySelector('.product-form__submit');
      if (!submitBtn || submitBtn.disabled) return;

      e.preventDefault();
      submitBtn.disabled = true;

      const formData = new FormData(productForm);
      fetch(window.theme.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      })
        .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
        .then(({ status, body }) => {
          if (status === 200 || status === 201) {
            updateCartCount(body.items ? body.items.reduce((s, i) => s + i.quantity, 0) : body.item_count);
            openDrawer();
            // Refresh drawer contents
            setTimeout(() => window.location.reload(), 300);
          } else {
            alert(body.description || 'Something went wrong adding to cart.');
          }
        })
        .catch(() => productForm.submit())
        .finally(() => (submitBtn.disabled = false));
    });
  }

  /* ---------- Variant selection on product page ---------- */
  const variantSelect = document.getElementById('VariantSelect');
  if (variantSelect) {
    variantSelect.addEventListener('change', function () {
      const option = variantSelect.selectedOptions[0];
      const hiddenId = document.getElementById('ProductSelect');
      if (hiddenId) hiddenId.value = option.value;

      const soldOut = option.dataset.soldOut === 'true';
      const submitBtn = document.querySelector('.product-form__submit');
      if (submitBtn) {
        submitBtn.disabled = soldOut;
        submitBtn.querySelector('span').textContent = soldOut
          ? window.theme.strings.soldOut
          : window.theme.strings.addToCart;
      }
    });
  }
})();

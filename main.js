// Stitchwell Menswear & Clothing Merchant - Main JS Controller

import { READYMADE_PRODUCTS } from "./data.js";
import { initDesigner } from "./designer.js";

// Application State
let cart = [];
let selectedService = "bespoke-suit"; // default booking service

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Interactive Garment Customizer
  initDesigner("designer-customizer-container", addToCart);

  // 2. Load Cart from LocalStorage
  loadCart();

  // 3. Render Catalog Products
  renderCatalog("all");

  // 4. Setup Event Listeners
  setupEventListeners();

  // 5. Active Nav state on scroll
  setupScrollSpy();
});

// Setup Event Listeners
function setupEventListeners() {
  // Navigation active state toggle & click scrolling
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 80, // Account for sticky header
          behavior: "smooth"
        });
      }

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Floating Cart Open/Close
  const cartToggleBtn = document.getElementById("cart-toggle-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartOverlay = document.getElementById("cart-drawer-overlay");

  if (cartToggleBtn) {
    cartToggleBtn.addEventListener("click", () => {
      cartOverlay.classList.add("active");
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartOverlay.classList.remove("active");
    });
  }

  // Click outside cart drawer to close
  if (cartOverlay) {
    cartOverlay.addEventListener("click", (e) => {
      if (e.target === cartOverlay) {
        cartOverlay.classList.remove("active");
      }
    });
  }

  // Catalog Category Filters
  const catalogFilters = document.querySelectorAll("#catalog-filters .filter-tag");
  catalogFilters.forEach(tag => {
    tag.addEventListener("click", () => {
      catalogFilters.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");
      const category = tag.getAttribute("data-filter-cat");
      renderCatalog(category);
    });
  });

  // Booking Service Card Selector
  const serviceCards = document.querySelectorAll(".service-card-select");
  serviceCards.forEach(card => {
    card.addEventListener("click", () => {
      serviceCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedService = card.getAttribute("data-service-val");
    });
  });

  // Appointment Form Submission
  const bookingForm = document.getElementById("appointment-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("b-name").value.trim();
      const email = document.getElementById("b-email").value.trim();
      const phone = document.getElementById("b-phone").value.trim();
      const date = document.getElementById("b-date").value;
      const time = document.getElementById("b-time").value;
      const notes = document.getElementById("b-notes").value.trim();

      if (!name || !email || !phone || !date || !time) {
        showToast("Please fill in all required fields.", true);
        return;
      }

      // Save Booking appointment to Local Storage
      const bookingData = {
        id: `book-${Date.now()}`,
        name,
        email,
        phone,
        service: selectedService,
        date,
        time,
        notes
      };

      const existingBookings = JSON.parse(localStorage.getItem("stitchwell_bookings") || "[]");
      existingBookings.push(bookingData);
      localStorage.setItem("stitchwell_bookings", JSON.stringify(existingBookings));

      // Visual Success
      showBookingSuccessModal(bookingData);
      bookingForm.reset();
    });
  }

  // Checkout modal controls
  const checkoutBtn = document.getElementById("cart-checkout-btn");
  const checkoutModal = document.getElementById("checkout-modal-overlay");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const checkoutForm = document.getElementById("checkout-shipping-form");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Your cart is empty.", true);
        return;
      }
      // Populate summary list in checkout modal
      populateCheckoutSummary();
      checkoutModal.classList.add("active");
      // Close cart drawer
      cartOverlay.classList.remove("active");
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      checkoutModal.classList.remove("active");
    });
  }

  if (checkoutModal) {
    checkoutModal.addEventListener("click", (e) => {
      if (e.target === checkoutModal) {
        checkoutModal.classList.remove("active");
      }
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const cName = document.getElementById("c-name").value.trim();
      const cPhone = document.getElementById("c-phone").value.trim();
      const cEmail = document.getElementById("c-email").value.trim();
      const cAddr = document.getElementById("c-address").value.trim();

      if (!cName || !cPhone || !cEmail || !cAddr) {
        showToast("Please complete the billing details.", true);
        return;
      }

      // Finalize Order
      const orderData = {
        id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
        customer: { name: cName, phone: cPhone, email: cEmail, address: cAddr },
        items: cart,
        total: calculateCartTotal()
      };

      // Save order to Local Storage
      const existingOrders = JSON.parse(localStorage.getItem("stitchwell_orders") || "[]");
      existingOrders.push(orderData);
      localStorage.setItem("stitchwell_orders", JSON.stringify(existingOrders));

      // Clear Cart
      cart = [];
      saveCart();
      updateCartUI();

      // Close modal
      checkoutModal.classList.remove("active");
      checkoutForm.reset();

      // Show Order Success Toast & Alert
      showOrderSuccessAlert(orderData);
    });
  }

  // General Contact Form Submission
  const contactForm = document.getElementById("direct-contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("con-name").value.trim();
      const msg = document.getElementById("con-msg").value.trim();
      
      if (!name || !msg) {
        showToast("Please provide your name and message.", true);
        return;
      }
      
      showToast("Thank you! Our tailors will contact you shortly.");
      contactForm.reset();
    });
  }
}

// Render Products in Catalog
function renderCatalog(categoryFilter) {
  const container = document.getElementById("catalog-products-grid");
  if (!container) return;

  const filteredProducts = categoryFilter === "all" 
    ? READYMADE_PRODUCTS 
    : READYMADE_PRODUCTS.filter(p => p.category === categoryFilter);

  // Update counts
  const stats = document.getElementById("catalog-stats-count");
  if (stats) {
    stats.textContent = `Showing ${filteredProducts.length} premium designs`;
  }

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="grid-empty-state">
        <p>No products available in this category at the moment.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredProducts.map(prod => `
    <div class="product-card" data-product-id="${prod.id}">
      <div class="product-tags">
        ${prod.tags.map(tag => `<span class="prod-tag">${tag}</span>`).join('')}
      </div>
      <div class="product-visual">
        ${prod.imageSvg}
      </div>
      <div class="product-meta">
        <span class="product-category">${prod.category}</span>
        <span class="product-price">$${prod.price}</span>
      </div>
      <h4 class="product-title">${prod.name}</h4>
      <div class="product-rating-bar">
        <div class="stars-row">
          ${getStarsHtml(prod.rating)}
        </div>
        <span class="rating-count">(${prod.reviews} reviews)</span>
      </div>
      <p class="product-desc-short">${prod.description}</p>
      <div class="product-actions">
        <button class="btn btn-secondary quick-add-btn" data-add-id="${prod.id}">
          Add To Order
        </button>
      </div>
    </div>
  `).join('');

  // Bind Quick Add Buttons
  const addBtns = container.querySelectorAll(".quick-add-btn");
  addBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const prodId = btn.getAttribute("data-add-id");
      const product = READYMADE_PRODUCTS.find(p => p.id === prodId);
      if (product) {
        addToCart({
          id: `${product.id}-${Date.now()}`,
          name: product.name,
          price: product.price,
          isCustom: false,
          details: product.category,
          imageSvg: product.imageSvg
        });
        showToast(`Added ${product.name} to order!`);
      }
    });
  });
}

// Helper for Star Ratings
function getStarsHtml(rating) {
  let stars = "";
  const floorRating = Math.floor(rating);
  for (let i = 0; i < 5; i++) {
    if (i < floorRating) {
      stars += "★";
    } else {
      stars += "☆";
    }
  }
  return stars;
}

// Add Item to Cart
function addToCart(item) {
  cart.push(item);
  saveCart();
  updateCartUI();
  
  // Highlight/open the cart drawer when something is added
  document.getElementById("cart-drawer-overlay").classList.add("active");
}

// Remove Item from Cart
function removeFromCart(cartItemId) {
  cart = cart.filter(item => item.id !== cartItemId);
  saveCart();
  updateCartUI();
}

// Calculate Total
function calculateCartTotal() {
  return cart.reduce((total, item) => total + item.price, 0);
}

// Save Cart to Local Storage
function saveCart() {
  localStorage.setItem("stitchwell_cart", JSON.stringify(cart));
}

// Load Cart from Local Storage
function loadCart() {
  const saved = localStorage.getItem("stitchwell_cart");
  if (saved) {
    try {
      cart = JSON.parse(saved);
      updateCartUI();
    } catch (e) {
      cart = [];
    }
  }
}

// Update Cart User Interface (Drawer contents, badge count, subtotal)
function updateCartUI() {
  // Update badge count
  const badges = document.querySelectorAll(".cart-badge");
  badges.forEach(b => {
    b.textContent = cart.length;
    b.style.display = cart.length === 0 ? "none" : "flex";
  });

  const cartList = document.getElementById("cart-items-list");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const emptyState = document.getElementById("cart-empty-state");

  if (!cartList || !cartSubtotal) return;

  if (cart.length === 0) {
    cartList.style.display = "none";
    emptyState.style.display = "flex";
    cartSubtotal.textContent = "$0";
    return;
  }

  cartList.style.display = "flex";
  emptyState.style.display = "none";

  cartList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-preview">
        ${item.imageSvg}
      </div>
      <div class="cart-item-details">
        <span class="cart-item-title">${item.name}</span>
        <span class="cart-item-desc">
          ${item.isCustom 
            ? `Bespoke Fit: ${item.details.fit} (${item.details.measurements.chest}" Chest, ${item.details.measurements.waist}" Waist)` 
            : `Premium Ready-Made Wear`}
        </span>
        <div class="cart-item-meta">
          <span class="cart-item-price">$${item.price}</span>
          <button class="cart-item-remove-btn" data-remove-id="${item.id}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  cartSubtotal.textContent = `$${calculateCartTotal()}`;

  // Bind Remove Buttons
  const removeBtns = cartList.querySelectorAll(".cart-item-remove-btn");
  removeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const removeId = btn.getAttribute("data-remove-id");
      removeFromCart(removeId);
      showToast("Item removed from order.");
    });
  });
}

// Populate Checkout Modal Summary
function populateCheckoutSummary() {
  const summaryContainer = document.getElementById("checkout-summary-list");
  if (!summaryContainer) return;

  let itemsHtml = cart.map(item => `
    <div class="chk-item">
      <span class="chk-item-name">${item.name}</span>
      <span class="chk-item-price">$${item.price}</span>
    </div>
  `).join('');

  const totalHtml = `
    <div class="chk-total-row">
      <span>Grand Total:</span>
      <span class="chk-total-price">$${calculateCartTotal()}</span>
    </div>
  `;

  summaryContainer.innerHTML = itemsHtml + totalHtml;
}

// Booking success visual feedback (modal)
function showBookingSuccessModal(booking) {
  // Create full-overlay notification
  const modal = document.createElement("div");
  modal.className = "modal-overlay active";
  modal.style.zIndex = "1000";
  modal.innerHTML = `
    <div class="modal-box text-center" style="text-align: center;">
      <div style="color: var(--color-accent); font-size: 4rem; margin-bottom: 1.5rem;">✔</div>
      <h3 style="margin-bottom: 1rem;">Fitting Appointment Secured!</h3>
      <p style="margin-bottom: 2rem;">Dear <strong>${booking.name}</strong>, your bespoke appointment for <strong>${booking.service.replace('-', ' ').toUpperCase()}</strong> has been booked successfully.</p>
      
      <div style="background-color: var(--bg-primary); padding: 1.5rem; text-align: left; border: 1px solid var(--border-color); margin-bottom: 2rem; font-size: 0.8rem; line-height: 1.8;">
        <div><strong>Appointment ID:</strong> ${booking.id}</div>
        <div><strong>Date:</strong> ${booking.date}</div>
        <div><strong>Time slot:</strong> ${booking.time}</div>
        <div><strong>Selected Service:</strong> Bespoke Fitting Session</div>
      </div>
      
      <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 2rem;">A confirmation schedule card has been generated. Our master tailor will call you at <strong>${booking.phone}</strong> to coordinate details.</p>
      
      <button class="btn btn-primary" id="close-success-booking-btn">Back to Stitchwell</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector("#close-success-booking-btn").addEventListener("click", () => {
    modal.classList.remove("active");
    setTimeout(() => modal.remove(), 400);
  });
}

// Order placement success alert
function showOrderSuccessAlert(order) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay active";
  modal.style.zIndex = "1000";
  modal.innerHTML = `
    <div class="modal-box" style="text-align: center;">
      <div style="color: var(--color-accent); font-size: 4rem; margin-bottom: 1.5rem;">✉</div>
      <h3 style="margin-bottom: 1rem;">Bespoke Order Received!</h3>
      <p style="margin-bottom: 2rem;">Thank you, <strong>${order.customer.name}</strong>! Your tailoring order <strong>#${order.id}</strong> has been successfully registered.</p>
      
      <div style="background-color: var(--bg-primary); padding: 1.5rem; text-align: left; border: 1px solid var(--border-color); margin-bottom: 2rem; font-size: 0.8rem; line-height: 1.8;">
        <div><strong>Order Reference:</strong> ${order.id}</div>
        <div><strong>Delivery Address:</strong> ${order.customer.address}</div>
        <div><strong>Contact Email:</strong> ${order.customer.email}</div>
        <div><strong>Subtotal Charged:</strong> $${order.total}</div>
        <div><strong>Status:</strong> Processing (Fitting Required for Bespoke)</div>
      </div>
      
      <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 2rem;">Since your order contains premium items, our design merchant will contact you to verify coordinates/fittings prior to tailoring cut.</p>
      
      <button class="btn btn-primary" id="close-success-order-btn">Done</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector("#close-success-order-btn").addEventListener("click", () => {
    modal.classList.remove("active");
    setTimeout(() => modal.remove(), 400);
  });
}

// Scrollspy navigation active state toggle
function setupScrollSpy() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  window.addEventListener("scroll", () => {
    let currentId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 180)) {
        currentId = `#${section.getAttribute("id")}`;
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === currentId) {
          link.classList.add("active");
        }
      });
    }
  });
}

// Show Toast Alerts
function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.className = "toast-message";
  if (isError) {
    toast.style.borderLeftColor = "#ff4d4d";
  }
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="toast-icon" style="color: ${isError ? '#ff4d4d' : 'var(--color-accent)'}">
      ${isError 
        ? `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`
        : `<polyline points="20 6 9 17 4 12"></polyline>`
      }
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add("show"), 50);
  
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

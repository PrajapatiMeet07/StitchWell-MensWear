// Stitchwell Menswear & Clothing Merchant - Garment Designer

import { FABRICS, STYLE_OPTIONS } from "./data.js";

// Initial customizer state
let designerState = {
  garmentType: "suit", // suit, blazer, shirt
  fabric: FABRICS[0],  // default to Royal Navy Merino Wool
  lapel: STYLE_OPTIONS.lapels[0], // notch
  button: STYLE_OPTIONS.buttons[1], // single-2 (2 buttons)
  collar: STYLE_OPTIONS.collars[0], // spread (for shirt)
  cuff: STYLE_OPTIONS.cuffs[0], // single-barrel (for shirt)
  fit: STYLE_OPTIONS.fits[1], // tailored fit
  measurements: {
    chest: 40,
    waist: 34,
    shoulder: 18,
    sleeve: 25,
    length: 30
  }
};

// Callback to trigger cart updates in main.js
let onAddToCartCallback = null;

export function initDesigner(containerId, onAddToCart) {
  const container = document.getElementById(containerId);
  if (!container) return;
  onAddToCartCallback = onAddToCart;

  renderDesignerUI(container);
  updatePreview();
}

function renderDesignerUI(container) {
  container.innerHTML = `
    <div class="designer-grid">
      <!-- Left side: Garment Preview Visualizer -->
      <div class="designer-preview-card">
        <div class="preview-header">
          <span class="preview-badge">Interactive 2D Canvas</span>
          <h3>Your Custom Creation</h3>
        </div>
        <div class="visualizer-canvas-container" id="designer-canvas-container">
          <!-- SVG preview injected here -->
        </div>
        <div class="price-display-wrapper">
          <div class="price-breakdown">
            <span id="garment-base-price">Base: $450</span>
            <span id="garment-fabric-surcharge">+ Fabric Surcharge: $150</span>
            <span id="garment-styling-surcharge">+ Styling options: $0</span>
          </div>
          <div class="total-price-bar">
            <span>Estimated Price:</span>
            <strong id="garment-total-price">$600</strong>
          </div>
        </div>
      </div>

      <!-- Right side: Selection Panels -->
      <div class="designer-controls-card">
        <div class="controls-tabs">
          <button class="tab-btn active" data-tab="garment">1. Garment & Fabric</button>
          <button class="tab-btn" data-tab="details">2. Style & Details</button>
          <button class="tab-btn" data-tab="measurements">3. Measurements</button>
        </div>

        <div class="tab-content active" id="tab-garment">
          <div class="control-section">
            <h4>Choose Garment Type</h4>
            <div class="garment-type-options grid-3">
              ${STYLE_OPTIONS.garmentTypes.map(gt => `
                <button class="choice-btn ${designerState.garmentType === gt.id ? 'selected' : ''}" data-garment-type="${gt.id}">
                  <span class="choice-name">${gt.name}</span>
                  <span class="choice-price">Base: $${gt.basePrice}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="control-section">
            <h4>Select Fabric & Material</h4>
            <div class="fabric-filter-tags">
              <button class="filter-tag active" data-filter="all">All</button>
              <button class="filter-tag" data-filter="Wool">Wool</button>
              <button class="filter-tag" data-filter="Cotton">Cotton</button>
              <button class="filter-tag" data-filter="Linen">Linen</button>
              <button class="filter-tag" data-filter="Velvet">Velvet</button>
            </div>
            <div class="fabric-grid" id="fabric-selection-grid">
              ${FABRICS.map(fab => `
                <div class="fabric-card ${designerState.fabric.id === fab.id ? 'selected' : ''}" data-fabric-id="${fab.id}" data-fabric-type="${fab.type}">
                  <div class="fabric-color-bubble" style="background-color: ${fab.color};">
                    ${fab.pattern !== 'solid' ? `<div class="fabric-pattern-overlay ${fab.pattern}"></div>` : ''}
                  </div>
                  <div class="fabric-info">
                    <span class="fabric-name">${fab.name}</span>
                    <span class="fabric-desc">${fab.description}</span>
                    <span class="fabric-surcharge">+$${fab.price} Premium</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="tab-content" id="tab-details">
          <!-- Suit / Blazer Details -->
          <div id="suit-details-wrapper">
            <div class="control-section">
              <h4>Lapel Style</h4>
              <div class="details-options grid-3">
                ${STYLE_OPTIONS.lapels.map(lap => `
                  <button class="choice-btn ${designerState.lapel.id === lap.id ? 'selected' : ''}" data-lapel-id="${lap.id}">
                    <span class="choice-name">${lap.name}</span>
                    <span class="choice-price">${lap.price > 0 ? `+$${lap.price}` : 'Incl.'}</span>
                  </button>
                `).join('')}
              </div>
              <p class="section-hint" id="lapel-hint">${designerState.lapel.description}</p>
            </div>

            <div class="control-section">
              <h4>Jacket Button Closure</h4>
              <div class="details-options grid-2">
                ${STYLE_OPTIONS.buttons.map(btn => `
                  <button class="choice-btn ${designerState.button.id === btn.id ? 'selected' : ''}" data-button-id="${btn.id}">
                    <span class="choice-name">${btn.name}</span>
                    <span class="choice-price">${btn.price > 0 ? `+$${btn.price}` : 'Incl.'}</span>
                  </button>
                `).join('')}
              </div>
              <p class="section-hint" id="button-hint">${designerState.button.description}</p>
            </div>
          </div>

          <!-- Shirt Specific Details -->
          <div id="shirt-details-wrapper" style="display: none;">
            <div class="control-section">
              <h4>Collar Style</h4>
              <div class="details-options grid-2">
                ${STYLE_OPTIONS.collars.map(col => `
                  <button class="choice-btn ${designerState.collar.id === col.id ? 'selected' : ''}" data-collar-id="${col.id}">
                    <span class="choice-name">${col.name}</span>
                    <span class="choice-price">${col.price > 0 ? `+$${col.price}` : 'Incl.'}</span>
                  </button>
                `).join('')}
              </div>
              <p class="section-hint" id="collar-hint">${designerState.collar.description}</p>
            </div>

            <div class="control-section">
              <h4>Cuff Selection</h4>
              <div class="details-options grid-2">
                ${STYLE_OPTIONS.cuffs.map(cuf => `
                  <button class="choice-btn ${designerState.cuff.id === cuf.id ? 'selected' : ''}" data-cuff-id="${cuf.id}">
                    <span class="choice-name">${cuf.name}</span>
                    <span class="choice-price">${cuf.price > 0 ? `+$${cuf.price}` : 'Incl.'}</span>
                  </button>
                `).join('')}
              </div>
              <p class="section-hint" id="cuff-hint">${designerState.cuff.description}</p>
            </div>
          </div>

          <!-- Fit selection shared -->
          <div class="control-section">
            <h4>Silhoutte / Fit Profile</h4>
            <div class="details-options grid-3">
              ${STYLE_OPTIONS.fits.map(ft => `
                <button class="choice-btn ${designerState.fit.id === ft.id ? 'selected' : ''}" data-fit-id="${ft.id}">
                  <span class="choice-name">${ft.name}</span>
                </button>
              `).join('')}
            </div>
            <p class="section-hint" id="fit-hint">${designerState.fit.description}</p>
          </div>
        </div>

        <div class="tab-content" id="tab-measurements">
          <div class="control-section">
            <div class="measurements-header">
              <h4>Tailored Measurements (Inches)</h4>
              <button class="text-link-btn" id="autofill-size-btn">Auto-Fill Standard Size</button>
            </div>
            <div class="measurements-form-grid">
              <div class="measurement-input-group">
                <label for="m-chest">Chest Circumference</label>
                <div class="range-spinner-wrap">
                  <input type="range" id="m-chest" min="32" max="56" value="${designerState.measurements.chest}" />
                  <span class="value-bubble" id="val-chest">${designerState.measurements.chest}"</span>
                </div>
              </div>
              <div class="measurement-input-group">
                <label for="m-waist">Waist Circumference</label>
                <div class="range-spinner-wrap">
                  <input type="range" id="m-waist" min="26" max="50" value="${designerState.measurements.waist}" />
                  <span class="value-bubble" id="val-waist">${designerState.measurements.waist}"</span>
                </div>
              </div>
              <div class="measurement-input-group">
                <label for="m-shoulder">Shoulder Width</label>
                <div class="range-spinner-wrap">
                  <input type="range" id="m-shoulder" min="15" max="24" value="${designerState.measurements.shoulder}" />
                  <span class="value-bubble" id="val-shoulder">${designerState.measurements.shoulder}"</span>
                </div>
              </div>
              <div class="measurement-input-group">
                <label for="m-sleeve">Sleeve Length</label>
                <div class="range-spinner-wrap">
                  <input type="range" id="m-sleeve" min="20" max="32" value="${designerState.measurements.sleeve}" />
                  <span class="value-bubble" id="val-sleeve">${designerState.measurements.sleeve}"</span>
                </div>
              </div>
              <div class="measurement-input-group">
                <label for="m-length">Jacket / Shirt Length</label>
                <div class="range-spinner-wrap">
                  <input type="range" id="m-length" min="24" max="38" value="${designerState.measurements.length}" />
                  <span class="value-bubble" id="val-length">${designerState.measurements.length}"</span>
                </div>
              </div>
            </div>
            <div class="measurement-disclaimer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="alert-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Our master tailors will verify your sizing via video/in-store fitting before crafting.</span>
            </div>
          </div>

          <div class="submit-garment-section">
            <button class="btn btn-primary btn-block btn-lg" id="add-custom-to-cart-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Add Custom Bespoke to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Event Listeners
  bindEvents(container);
}

function bindEvents(container) {
  // Tab Switching
  const tabs = container.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      container.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));

      tab.classList.add("active");
      const targetId = `tab-${tab.getAttribute("data-tab")}`;
      container.querySelector(`#${targetId}`).classList.add("active");
    });
  });

  // Garment Type selection
  const garmentBtns = container.querySelectorAll("[data-garment-type]");
  garmentBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      garmentBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      
      const type = btn.getAttribute("data-garment-type");
      designerState.garmentType = type;

      // Toggle details panels based on type
      const suitDetails = container.querySelector("#suit-details-wrapper");
      const shirtDetails = container.querySelector("#shirt-details-wrapper");

      if (type === "shirt") {
        suitDetails.style.display = "none";
        shirtDetails.style.display = "block";
        // Default to a cotton fabric if wool is currently selected
        if (designerState.fabric.type === "Wool" || designerState.fabric.type === "Tweed" || designerState.fabric.type === "Velvet") {
          const cottonFab = FABRICS.find(f => f.type === "Cotton") || FABRICS[0];
          setSelectedFabric(cottonFab.id);
        }
      } else {
        suitDetails.style.display = "block";
        shirtDetails.style.display = "none";
        // Default to wool if cotton is currently selected
        if (designerState.fabric.type === "Cotton" || designerState.fabric.type === "Linen") {
          const woolFab = FABRICS.find(f => f.type === "Wool") || FABRICS[0];
          setSelectedFabric(woolFab.id);
        }
      }

      updatePreview();
    });
  });

  // Fabric Filter Tag Selection
  const filterTags = container.querySelectorAll(".filter-tag");
  filterTags.forEach(tag => {
    tag.addEventListener("click", () => {
      filterTags.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");

      const filter = tag.getAttribute("data-filter");
      const fabricCards = container.querySelectorAll(".fabric-card");
      fabricCards.forEach(card => {
        const type = card.getAttribute("data-fabric-type");
        if (filter === "all" || type === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Fabric Card Selection
  const fabricCards = container.querySelectorAll(".fabric-card");
  fabricCards.forEach(card => {
    card.addEventListener("click", () => {
      fabricCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      const fabricId = card.getAttribute("data-fabric-id");
      const selectedFabric = FABRICS.find(f => f.id === fabricId);
      designerState.fabric = selectedFabric;
      updatePreview();
    });
  });

  // Lapel selection
  const lapelBtns = container.querySelectorAll("[data-lapel-id]");
  lapelBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      lapelBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      const lapId = btn.getAttribute("data-lapel-id");
      designerState.lapel = STYLE_OPTIONS.lapels.find(l => l.id === lapId);
      container.querySelector("#lapel-hint").textContent = designerState.lapel.description;
      updatePreview();
    });
  });

  // Button selection
  const buttonBtns = container.querySelectorAll("[data-button-id]");
  buttonBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      buttonBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      const btnId = btn.getAttribute("data-button-id");
      designerState.button = STYLE_OPTIONS.buttons.find(b => b.id === btnId);
      container.querySelector("#button-hint").textContent = designerState.button.description;
      updatePreview();
    });
  });

  // Collar selection
  const collarBtns = container.querySelectorAll("[data-collar-id]");
  collarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      collarBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      const colId = btn.getAttribute("data-collar-id");
      designerState.collar = STYLE_OPTIONS.collars.find(c => c.id === colId);
      container.querySelector("#collar-hint").textContent = designerState.collar.description;
      updatePreview();
    });
  });

  // Cuff selection
  const cuffBtns = container.querySelectorAll("[data-cuff-id]");
  cuffBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      cuffBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      const cufId = btn.getAttribute("data-cuff-id");
      designerState.cuff = STYLE_OPTIONS.cuffs.find(c => c.id === cufId);
      container.querySelector("#cuff-hint").textContent = designerState.cuff.description;
      updatePreview();
    });
  });

  // Fit selection
  const fitBtns = container.querySelectorAll("[data-fit-id]");
  fitBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      fitBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      const fitId = btn.getAttribute("data-fit-id");
      designerState.fit = STYLE_OPTIONS.fits.find(f => f.id === fitId);
      container.querySelector("#fit-hint").textContent = designerState.fit.description;
    });
  });

  // Measurement range sliders
  const sliders = ["chest", "waist", "shoulder", "sleeve", "length"];
  sliders.forEach(key => {
    const slider = container.querySelector(`#m-${key}`);
    const display = container.querySelector(`#val-${key}`);
    slider.addEventListener("input", (e) => {
      const val = e.target.value;
      designerState.measurements[key] = parseInt(val);
      display.textContent = `${val}"`;
    });
  });

  // Auto fill standard size button
  container.querySelector("#autofill-size-btn").addEventListener("click", () => {
    // Fill medium/standard sizes
    const standardSizes = { chest: 40, waist: 34, shoulder: 18, sleeve: 25, length: 30 };
    sliders.forEach(key => {
      const slider = container.querySelector(`#m-${key}`);
      const display = container.querySelector(`#val-${key}`);
      slider.value = standardSizes[key];
      designerState.measurements[key] = standardSizes[key];
      display.textContent = `${standardSizes[key]}"`;
    });
    showToastNotification("Filled standard size M (40R)");
  });

  // Add custom garment to cart button
  container.querySelector("#add-custom-to-cart-btn").addEventListener("click", () => {
    if (onAddToCartCallback) {
      const customItem = {
        id: `custom-${Date.now()}`,
        name: `Bespoke ${designerState.garmentType.toUpperCase()} (${designerState.fabric.name})`,
        price: calculateTotalPrice(),
        isCustom: true,
        details: {
          garmentType: designerState.garmentType,
          fabric: designerState.fabric.name,
          lapel: designerState.garmentType !== 'shirt' ? designerState.lapel.name : null,
          button: designerState.garmentType !== 'shirt' ? designerState.button.name : null,
          collar: designerState.garmentType === 'shirt' ? designerState.collar.name : null,
          cuff: designerState.garmentType === 'shirt' ? designerState.cuff.name : null,
          fit: designerState.fit.name,
          measurements: { ...designerState.measurements }
        },
        imageSvg: generatePreviewSvg()
      };
      onAddToCartCallback(customItem);
      showToastNotification("Bespoke custom garment added to cart!");
    }
  });

  // Helper inside binding to set fabric selection programmatically
  function setSelectedFabric(fabricId) {
    const cards = container.querySelectorAll(".fabric-card");
    cards.forEach(c => {
      c.classList.remove("selected");
      if (c.getAttribute("data-fabric-id") === fabricId) {
        c.classList.add("selected");
        const fab = FABRICS.find(f => f.id === fabricId);
        designerState.fabric = fab;
      }
    });
  }
}

function calculateTotalPrice() {
  const gType = STYLE_OPTIONS.garmentTypes.find(gt => gt.id === designerState.garmentType);
  const base = gType ? gType.basePrice : 0;
  const fabricSurcharge = designerState.fabric ? designerState.fabric.price : 0;
  
  let optionsSurcharge = 0;
  if (designerState.garmentType === "shirt") {
    optionsSurcharge += designerState.collar.price;
    optionsSurcharge += designerState.cuff.price;
  } else {
    optionsSurcharge += designerState.lapel.price;
    optionsSurcharge += designerState.button.price;
  }

  return base + fabricSurcharge + optionsSurcharge;
}

function updatePreview() {
  const container = document.getElementById("designer-canvas-container");
  if (!container) return;

  container.innerHTML = generatePreviewSvg();

  // Update prices in display
  const base = STYLE_OPTIONS.garmentTypes.find(gt => gt.id === designerState.garmentType).basePrice;
  const fabPrice = designerState.fabric.price;
  let optPrice = 0;
  if (designerState.garmentType === "shirt") {
    optPrice += designerState.collar.price + designerState.cuff.price;
  } else {
    optPrice += designerState.lapel.price + designerState.button.price;
  }
  const total = base + fabPrice + optPrice;

  document.getElementById("garment-base-price").textContent = `Base: $${base}`;
  document.getElementById("garment-fabric-surcharge").textContent = `+ Fabric Surcharge: $${fabPrice}`;
  document.getElementById("garment-styling-surcharge").textContent = `+ Styling Options: $${optPrice}`;
  document.getElementById("garment-total-price").textContent = `$${total}`;
}

function generatePreviewSvg() {
  const color = designerState.fabric.color;
  const pattern = designerState.fabric.pattern;
  
  let patternDef = "";
  let fabricFill = `fill="${color}"`;

  // Custom textures injected as inline definitions
  if (pattern === "pinstripe") {
    patternDef = `
      <pattern id="pat-custom-pinstripe" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="24" height="24" fill="${color}" />
        <line x1="12" y1="0" x2="12" y2="24" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
      </pattern>
    `;
    fabricFill = 'fill="url(#pat-custom-pinstripe)"';
  } else if (pattern === "plaid") {
    patternDef = `
      <pattern id="pat-custom-plaid" width="30" height="30" patternUnits="userSpaceOnUse">
        <rect width="30" height="30" fill="${color}" />
        <!-- Vertical grid lines -->
        <line x1="0" y1="15" x2="30" y2="15" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
        <line x1="15" y1="0" x2="15" y2="30" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
        <!-- Accent overlay grid lines -->
        <line x1="0" y1="5" x2="30" y2="5" stroke="rgba(0,0,0,0.25)" stroke-width="0.75" />
        <line x1="5" y1="0" x2="5" y2="30" stroke="rgba(0,0,0,0.25)" stroke-width="0.75" />
        <line x1="0" y1="25" x2="30" y2="25" stroke="rgba(0,0,0,0.25)" stroke-width="0.75" />
        <line x1="25" y1="0" x2="25" y2="30" stroke="rgba(0,0,0,0.25)" stroke-width="0.75" />
      </pattern>
    `;
    fabricFill = 'fill="url(#pat-custom-plaid)"';
  }

  // Draw appropriate garment based on type
  if (designerState.garmentType === "suit" || designerState.garmentType === "blazer") {
    return drawJacketSvg(patternDef, fabricFill, color);
  } else {
    return drawShirtSvg(patternDef, fabricFill, color);
  }
}

function drawJacketSvg(patternDef, fabricFill, rawColor) {
  // Determine lapel style details
  let leftLapelPath = "";
  let rightLapelPath = "";
  
  if (designerState.lapel.id === "notch") {
    // Traditional notch lapel paths
    leftLapelPath = `M 100,50 L 150,210 L 120,210 L 110,135 L 85,125 L 105,100 L 100,50 Z`;
    rightLapelPath = `M 200,50 L 150,210 L 180,210 L 190,135 L 215,125 L 195,100 L 200,50 Z`;
  } else if (designerState.lapel.id === "peak") {
    // Wing-style peak lapel paths
    leftLapelPath = `M 100,50 L 150,210 L 122,210 L 116,130 L 78,110 L 108,102 L 100,50 Z`;
    rightLapelPath = `M 200,50 L 150,210 L 178,210 L 184,130 L 222,110 L 192,102 L 200,50 Z`;
  } else {
    // Rounded shawl lapel paths
    leftLapelPath = `M 100,50 L 150,210 L 123,210 Q 100,160 90,120 Q 82,85 100,50 Z`;
    rightLapelPath = `M 200,50 L 150,210 L 177,210 Q 200,160 210,120 Q 218,85 200,50 Z`;
  }

  // Draw buttons based on selections
  let buttonsSvg = "";
  if (designerState.button.id === "single-1") {
    buttonsSvg = `<circle cx="150" cy="240" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>`;
  } else if (designerState.button.id === "single-2") {
    buttonsSvg = `
      <circle cx="150" cy="235" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
      <circle cx="150" cy="275" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
    `;
  } else if (designerState.button.id === "double-4") {
    buttonsSvg = `
      <circle cx="132" cy="230" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
      <circle cx="168" cy="230" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
      <circle cx="132" cy="270" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
      <circle cx="168" cy="270" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
    `;
  } else if (designerState.button.id === "double-6") {
    buttonsSvg = `
      <circle cx="130" cy="205" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
      <circle cx="170" cy="205" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
      <circle cx="131" cy="245" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
      <circle cx="169" cy="245" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
      <circle cx="132" cy="285" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
      <circle cx="168" cy="285" r="4.5" fill="#d4af37" stroke="#aa840c" stroke-width="1"/>
    `;
  }

  // Pocket square color (accented)
  const pocketSquare = designerState.fabric.id === 'crimson-velvet' || designerState.fabric.id === 'emerald-silk'
    ? `<path d="M 85,145 L 102,141 L 98,155 Z" fill="#ffffff" />`
    : `<path d="M 85,145 L 102,141 L 98,155 Z" fill="#8b0000" />`; // Red pocket square contrast

  // Lapel lighting/shading adjustments
  const lapelFillColor = lightenDarkenColor(rawColor, 12);
  const lapelShadowColor = lightenDarkenColor(rawColor, -15);

  return `
    <svg viewBox="0 0 300 400" width="100%" height="100%" class="customizer-svg">
      <defs>
        ${patternDef}
        <linearGradient id="jacket-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.45" />
        </linearGradient>
      </defs>
      
      <!-- BACKGROUND / SHIRT AND TIE IN THE CHEST OUTLINE -->
      <!-- White shirt -->
      <path d="M 100,50 L 150,210 L 200,50 Z" fill="#ffffff" />
      <!-- Red Silk Tie -->
      <path d="M 143,80 L 157,80 L 160,185 L 150,205 L 140,185 Z" fill="#800000" />
      <!-- Shirt collar fold -->
      <path d="M 100,50 L 150,90 L 125,75 Z M 200,50 L 150,90 L 175,75 Z" fill="#f0f2f5" stroke="#d0d4dc" stroke-width="0.5" />
      
      <!-- JACKET BODY BASE -->
      <path d="M 45,80 L 100,50 L 150,110 L 200,50 L 255,80 L 240,360 L 150,390 L 60,360 Z" ${fabricFill} />
      
      <!-- JACKET SLEEVES -->
      <!-- Left Sleeve -->
      <path d="M 45,80 L 20,280 L 48,285 L 75,170 Z" ${fabricFill} />
      <!-- Right Sleeve -->
      <path d="M 255,80 L 280,280 L 252,285 L 225,170 Z" ${fabricFill} />
      
      <!-- JACKET BODY OVERLAY SHADOW/LIGHT -->
      <path d="M 45,80 L 100,50 L 150,110 L 200,50 L 255,80 L 240,360 L 150,390 L 60,360 Z" fill="url(#jacket-grad)" style="mix-blend-mode: multiply;" />
      <!-- Sleeves overlay shadow -->
      <path d="M 45,80 L 20,280 L 48,285 L 75,170 Z" fill="url(#jacket-grad)" style="mix-blend-mode: multiply;" />
      <path d="M 255,80 L 280,280 L 252,285 L 225,170 Z" fill="url(#jacket-grad)" style="mix-blend-mode: multiply;" />

      <!-- LAPELS (WITH CUSTOM SELECTED STYLE PATHS) -->
      <!-- Left Lapel -->
      <path d="${leftLapelPath}" fill="${lapelFillColor}" stroke="${lapelShadowColor}" stroke-width="1.5" />
      <!-- Right Lapel -->
      <path d="${rightLapelPath}" fill="${lapelFillColor}" stroke="${lapelShadowColor}" stroke-width="1.5" />
      
      <!-- COLLAR NECK BAND -->
      <path d="M 100,50 Q 150,60 200,50 L 190,40 Q 150,48 110,40 Z" fill="${lapelShadowColor}" />

      <!-- POCKET SQUARE & FLAP POCKETS -->
      ${pocketSquare}
      <!-- Left flap pocket -->
      <path d="M 68,260 L 110,260 L 110,278 L 68,278 Z" fill="${lapelShadowColor}" opacity="0.8" />
      <!-- Right flap pocket -->
      <path d="M 190,260 L 232,260 L 232,278 L 190,278 Z" fill="${lapelShadowColor}" opacity="0.8" />

      <!-- INTERACTIVE BUTTON CLOSURES -->
      ${buttonsSvg}

      <!-- HANDSTITCHED LOOK (LAPEL EDGING) -->
      <path d="${leftLapelPath}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.75" stroke-dasharray="1.5,2" />
      <path d="${rightLapelPath}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.75" stroke-dasharray="1.5,2" />
    </svg>
  `;
}

function drawShirtSvg(patternDef, fabricFill, rawColor) {
  // Determine Collar Style
  let collarPathSvg = "";
  if (designerState.collar.id === "spread") {
    // Wide points
    collarPathSvg = `
      <path d="M 100,50 L 150,88 L 112,85 L 105,52 Z" fill="#ffffff" stroke="#ccc" stroke-width="0.5" />
      <path d="M 200,50 L 150,88 L 188,85 L 195,52 Z" fill="#ffffff" stroke="#ccc" stroke-width="0.5" />
    `;
  } else if (designerState.collar.id === "point") {
    // Narrow points going down
    collarPathSvg = `
      <path d="M 100,50 L 150,88 L 132,96 L 105,52 Z" fill="#ffffff" stroke="#ccc" stroke-width="0.5" />
      <path d="M 200,50 L 150,88 L 168,96 L 195,52 Z" fill="#ffffff" stroke="#ccc" stroke-width="0.5" />
    `;
  } else if (designerState.collar.id === "button-down") {
    // Point collar with tiny button dots
    collarPathSvg = `
      <path d="M 100,50 L 150,88 L 132,96 L 105,52 Z" fill="#ffffff" stroke="#ccc" stroke-width="0.5" />
      <path d="M 200,50 L 150,88 L 168,96 L 195,52 Z" fill="#ffffff" stroke="#ccc" stroke-width="0.5" />
      <!-- tiny button dots -->
      <circle cx="134" cy="92" r="1" fill="#444" />
      <circle cx="166" cy="92" r="1" fill="#444" />
    `;
  } else {
    // Mandarin: stand up band collar
    collarPathSvg = `
      <path d="M 105,52 Q 150,60 195,52 L 190,42 Q 150,48 110,42 Z" fill="#ffffff" stroke="#ccc" stroke-width="0.5" />
      <!-- button hook -->
      <circle cx="150" cy="50" r="1.5" fill="#444" />
    `;
  }

  // Cuffs Style
  let cuffsSvg = "";
  if (designerState.cuff.id === "double-french") {
    // French cuff: double folded, white cuffs with golden cufflinks
    cuffsSvg = `
      <!-- Left French Cuff -->
      <path d="M 18,276 L 50,281 L 46,300 L 14,295 Z" fill="#ffffff" stroke="#ddd" stroke-width="0.5" />
      <!-- Gold Cufflink Left -->
      <circle cx="32" cy="288" r="2.5" fill="#d4af37" />
      
      <!-- Right French Cuff -->
      <path d="M 282,276 L 250,281 L 254,300 L 286,295 Z" fill="#ffffff" stroke="#ddd" stroke-width="0.5" />
      <!-- Gold Cufflink Right -->
      <circle cx="268" cy="288" r="2.5" fill="#d4af37" />
    `;
  } else {
    // Single barrel: simple white cuffs with white buttons
    cuffsSvg = `
      <!-- Left Barrel Cuff -->
      <path d="M 19,277 L 49,281 L 46,294 L 16,290 Z" fill="#ffffff" stroke="#eee" stroke-width="0.5" />
      <circle cx="32" cy="285" r="1.5" fill="#fff" stroke="#ccc" stroke-width="0.5" />
      
      <!-- Right Barrel Cuff -->
      <path d="M 281,277 L 251,281 L 254,294 L 284,290 Z" fill="#ffffff" stroke="#eee" stroke-width="0.5" />
      <circle cx="268" cy="285" r="1.5" fill="#fff" stroke="#ccc" stroke-width="0.5" />
    `;
  }

  // Internal fabric shadow/lighting gradient
  return `
    <svg viewBox="0 0 300 400" width="100%" height="100%" class="customizer-svg">
      <defs>
        ${patternDef}
        <linearGradient id="shirt-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.25" />
        </linearGradient>
      </defs>

      <!-- SHIRT TORSO BODY -->
      <path d="M 50,85 L 105,52 L 150,75 L 195,52 L 250,85 L 235,360 L 150,380 L 65,360 Z" ${fabricFill} />
      
      <!-- SHIRT SLEEVES -->
      <!-- Left Sleeve -->
      <path d="M 50,85 L 18,276 L 49,281 L 78,175 Z" ${fabricFill} />
      <!-- Right Sleeve -->
      <path d="M 250,85 L 282,276 L 251,281 L 222,175 Z" ${fabricFill} />
      
      <!-- BODY GRADIENT LAYER -->
      <path d="M 50,85 L 105,52 L 150,75 L 195,52 L 250,85 L 235,360 L 150,380 L 65,360 Z" fill="url(#shirt-grad)" style="mix-blend-mode: multiply;" />
      <path d="M 50,85 L 18,276 L 49,281 L 78,175 Z" fill="url(#shirt-grad)" style="mix-blend-mode: multiply;" />
      <path d="M 250,85 L 282,276 L 251,281 L 222,175 Z" fill="url(#shirt-grad)" style="mix-blend-mode: multiply;" />

      <!-- FRONT CENTER PLACKET -->
      <path d="M 144,70 L 156,70 L 156,380 L 144,378 Z" fill="rgba(0, 0, 0, 0.05)" stroke="rgba(0, 0, 0, 0.1)" stroke-width="0.5" />
      
      <!-- SHIRT BUTTONS -->
      <circle cx="150" cy="115" r="3" fill="#fff" stroke="#ccc" stroke-width="0.5" />
      <circle cx="150" cy="155" r="3" fill="#fff" stroke="#ccc" stroke-width="0.5" />
      <circle cx="150" cy="195" r="3" fill="#fff" stroke="#ccc" stroke-width="0.5" />
      <circle cx="150" cy="235" r="3" fill="#fff" stroke="#ccc" stroke-width="0.5" />
      <circle cx="150" cy="275" r="3" fill="#fff" stroke="#ccc" stroke-width="0.5" />
      <circle cx="150" cy="315" r="3" fill="#fff" stroke="#ccc" stroke-width="0.5" />
      <circle cx="150" cy="355" r="3" fill="#fff" stroke="#ccc" stroke-width="0.5" />

      <!-- DYNAMIC COLLARS -->
      ${collarPathSvg}

      <!-- DYNAMIC CUFFS -->
      ${cuffsSvg}

      <!-- Left pocket optional -->
      <path d="M 75,135 L 105,135 L 105,170 Q 105,180 90,180 Q 75,180 75,170 Z" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1" />
    </svg>
  `;
}

// Helper: Programmatically lighten/darken a hex color for shadows/outlines
function lightenDarkenColor(col, amt) {
  let usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }
  let num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + ((g | (b << 8) | (r << 16)).toString(16)).padStart(6, '0');
}

// Helper: Toast alerts
function showToastNotification(message) {
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="toast-icon">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  
  // Trigger transition
  setTimeout(() => toast.classList.add("show"), 50);
  
  // Remove after duration
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

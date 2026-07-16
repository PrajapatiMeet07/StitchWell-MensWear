// Stitchwell Menswear & Clothing Merchant - Data File

export const FABRICS = [
  {
    id: "royal-blue-wool",
    name: "Royal Navy Merino Wool",
    type: "Wool",
    color: "#1d2d50",
    pattern: "solid",
    price: 150,
    description: "100% Super 130s Merino Wool. Breathable, wrinkle-resistant, and perfect for year-round formal wear."
  },
  {
    id: "charcoal-pinstripe",
    name: "Charcoal Pinstripe Wool",
    type: "Wool",
    color: "#2b2b2b",
    pattern: "pinstripe",
    price: 180,
    description: "Classic power suit fabric with subtle silver pinstripes. Elegant drape and structural stability."
  },
  {
    id: "emerald-silk",
    name: "Emerald Imperial Silk Blend",
    type: "Silk Blend",
    color: "#0a3c2c",
    pattern: "solid",
    price: 220,
    description: "Lustrous silk and wool blend. Offers an exquisite sheen for dinner jackets, tuxedos, and gala wear."
  },
  {
    id: "forest-plaid",
    name: "Highland Forest Plaid",
    type: "Tweed",
    color: "#1e352f",
    pattern: "plaid",
    price: 160,
    description: "Premium tweed with rich green and earthy brown intersecting checks. Perfect for statement blazers."
  },
  {
    id: "crimson-velvet",
    name: "Crimson Royal Velvet",
    type: "Velvet",
    color: "#5c0612",
    pattern: "solid",
    price: 240,
    description: "Ultra-soft, deep crimson cotton velvet. Exudes luxury and luxury styling for smoking jackets."
  },
  {
    id: "classic-white-cotton",
    name: "Egyptian Giza White Cotton",
    type: "Cotton",
    color: "#f8f9fa",
    pattern: "solid",
    price: 70,
    description: "Long-staple Giza cotton with a smooth sateen weave. Highly breathable, soft, and crisp."
  },
  {
    id: "powder-blue-linen",
    name: "Italian Powder Blue Linen",
    type: "Linen",
    color: "#b0c4de",
    pattern: "solid",
    price: 85,
    description: "Lightweight, moisture-wicking premium linen. Tailored for summer comfort and relaxed elegance."
  },
  {
    id: "black-tuxedo-wool",
    name: "Midnight Black Barathea Wool",
    type: "Wool",
    color: "#0a0a0a",
    pattern: "solid",
    price: 200,
    description: "Traditional tuxedo fabric with a subtle pebbled weave that absorbs light for a deep, rich black finish."
  }
];

export const STYLE_OPTIONS = {
  garmentTypes: [
    { id: "suit", name: "Bespoke 2-Piece Suit", basePrice: 450 },
    { id: "blazer", name: "Custom Sport Jacket / Blazer", basePrice: 320 },
    { id: "shirt", name: "Custom Tailored Shirt", basePrice: 95 }
  ],
  lapels: [
    { id: "notch", name: "Classic Notch Lapel", price: 0, description: "Versatile, traditional, and suitable for all occasions." },
    { id: "peak", name: "Formal Peak Lapel", price: 30, description: "Bold, upward-pointing lapel. Ideal for formal suits and double-breasted jackets." },
    { id: "shawl", name: "Sleek Shawl Lapel", price: 45, description: "Rounded collar typical of dinner jackets and formal smoking jackets." }
  ],
  buttons: [
    { id: "single-1", name: "Single Breasted (1 Button)", price: 0, description: "Clean look, standard for tuxedos." },
    { id: "single-2", name: "Single Breasted (2 Buttons)", price: 0, description: "The timeless business standard." },
    { id: "double-4", name: "Double Breasted (4 Buttons)", price: 40, description: "Classic preppy, military, or formal look." },
    { id: "double-6", name: "Double Breasted (6 Buttons)", price: 50, description: "Vintage elegance, emphasizes height and shoulder width." }
  ],
  collars: [
    { id: "spread", name: "Modern Spread Collar", price: 0, description: "Flattering collar with wide points, perfect for medium to large tie knots." },
    { id: "point", name: "Classic Point Collar", price: 0, description: "Traditional collar with narrow spacing. Excellent with or without a tie." },
    { id: "button-down", name: "Button-Down Collar", price: 0, description: "Sporty, casual style. Keeps points neatly pinned to the shirt." },
    { id: "mandarin", name: "Minimalist Mandarin Collar", price: 15, description: "Stand-up band collar. Sleek, contemporary, and worn without a tie." }
  ],
  cuffs: [
    { id: "single-barrel", name: "Single Barrel (1-Button)", price: 0, description: "Simple, practical, and classic standard." },
    { id: "double-french", name: "French Cuff (Double)", price: 20, description: "Requires cufflinks. Elegant, formal, and traditional." }
  ],
  fits: [
    { id: "slim", name: "Slim Fit", description: "Contoured to the body with higher armholes and fitted chest/waist." },
    { id: "tailored", name: "Tailored Fit", description: "Slightly tapered silhouette, blending comfort with a clean modern line." },
    { id: "classic", name: "Classic Fit", description: "Relaxed cut through chest, shoulders, and waist for traditional drape." }
  ]
};

export const READYMADE_PRODUCTS = [
  {
    id: "rm-navy-suit",
    name: "Classic Navy Wool Suit",
    category: "suits",
    price: 499,
    rating: 4.8,
    reviews: 124,
    tags: ["Best Seller", "100% Wool"],
    description: "A timeless single-breasted, 2-button suit in premium navy wool. Includes pants and jacket. Perfect for executive wear or weddings.",
    features: ["Super 110s Merino Wool", "Half-canvas construction", "Classic notch lapels", "Includes unhemmed trousers"],
    imageSvg: `<svg viewBox="0 0 100 120" class="prod-svg">
      <defs>
        <linearGradient id="g-navy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1b2a47" />
          <stop offset="100%" stop-color="#0f192b" />
        </linearGradient>
      </defs>
      <!-- Jacket Outline -->
      <path d="M15,20 L35,12 L50,30 L65,12 L85,20 L80,95 L50,110 L20,95 Z" fill="url(#g-navy)" />
      <!-- Lapels -->
      <path d="M35,12 L50,55 L38,55 L35,32 L28,30 L35,12 Z" fill="#24385c" stroke="#101a2c" stroke-width="0.5" />
      <path d="M65,12 L50,55 L62,55 L65,32 L72,30 L65,12 Z" fill="#24385c" stroke="#101a2c" stroke-width="0.5" />
      <!-- Shirt v-neck -->
      <path d="M35,12 L50,55 L65,12 Z" fill="#ffffff" />
      <!-- Tie -->
      <path d="M47,22 L53,22 L55,50 L50,58 L45,50 Z" fill="#8b0000" />
      <!-- Collar -->
      <path d="M35,12 L50,22 L65,12 L50,14 Z" fill="#e0e0e0" />
      <!-- Pocket Square -->
      <path d="M26,40 L34,37 L32,45 L25,45 Z" fill="#8b0000" />
      <!-- Buttons -->
      <circle cx="49" cy="65" r="1.5" fill="#d4af37" />
      <circle cx="49" cy="78" r="1.5" fill="#d4af37" />
    </svg>`
  },
  {
    id: "rm-charcoal-suit",
    name: "Charcoal Double-Breasted Suit",
    category: "suits",
    price: 549,
    rating: 4.9,
    reviews: 86,
    tags: ["New", "Heritage Collection"],
    description: "Make a powerful statement with this charcoal grey double-breasted suit. Features peak lapels and structured shoulders.",
    features: ["Super 120s wool blend", "Peak lapel double-breasted silhouette", "6-button layout (2 to button)", "Satin internal lining"],
    imageSvg: `<svg viewBox="0 0 100 120" class="prod-svg">
      <defs>
        <linearGradient id="g-charcoal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#363636" />
          <stop offset="100%" stop-color="#1e1e1e" />
        </linearGradient>
      </defs>
      <!-- Jacket Outline -->
      <path d="M15,20 L35,12 L50,30 L65,12 L85,20 L80,95 L50,110 L20,95 Z" fill="url(#g-charcoal)" />
      <!-- Peak Lapels -->
      <path d="M35,12 L50,55 L42,55 L44,28 L30,24 L35,12 Z" fill="#4a4a4a" stroke="#1f1f1f" stroke-width="0.5" />
      <path d="M65,12 L50,55 L58,55 L56,28 L70,24 L65,12 Z" fill="#4a4a4a" stroke="#1f1f1f" stroke-width="0.5" />
      <!-- Shirt v-neck -->
      <path d="M35,12 L50,55 L65,12 Z" fill="#f0f4f8" />
      <!-- Black Tie -->
      <path d="M47,20 L53,20 L54,48 L50,55 L46,48 Z" fill="#111111" />
      <!-- Collar -->
      <path d="M35,12 L50,20 L65,12 L50,13 Z" fill="#d0d5dd" />
      <!-- Double Breasted Buttons -->
      <circle cx="43" cy="62" r="1.5" fill="#d4af37" />
      <circle cx="57" cy="62" r="1.5" fill="#d4af37" />
      <circle cx="43" cy="72" r="1.5" fill="#d4af37" />
      <circle cx="57" cy="72" r="1.5" fill="#d4af37" />
      <circle cx="43" cy="82" r="1.5" fill="#d4af37" />
      <circle cx="57" cy="82" r="1.5" fill="#d4af37" />
    </svg>`
  },
  {
    id: "rm-white-shirt",
    name: "Royal Oxford White Shirt",
    category: "shirts",
    price: 89,
    rating: 4.7,
    reviews: 215,
    tags: ["100% Egyptian Cotton"],
    description: "The ultimate wardrobe essential. Crafted from Giza Egyptian cotton with a rich royal Oxford weave that catches light subtly.",
    features: ["100% Egyptian Giza Cotton", "Formal French cuffs", "Elegant spread collar", "Easy-iron finish"],
    imageSvg: `<svg viewBox="0 0 100 120" class="prod-svg">
      <!-- Shirt Outline -->
      <path d="M20,25 L35,15 L50,28 L65,15 L80,25 L75,100 L50,105 L25,100 Z" fill="#ffffff" stroke="#e0e0e0" stroke-width="1" />
      <!-- Spread Collar -->
      <path d="M35,15 L50,28 L65,15 L50,18 Z" fill="#f5f5f5" stroke="#ccc" stroke-width="0.5" />
      <!-- Inner Neck Placket -->
      <path d="M47,28 L53,28 L53,105 L47,105 Z" fill="#fafafa" stroke="#e8e8e8" stroke-width="0.5" />
      <!-- Buttons -->
      <circle cx="50" cy="40" r="1" fill="#fff" stroke="#ccc" stroke-width="0.5" />
      <circle cx="50" cy="55" r="1" fill="#fff" stroke="#ccc" stroke-width="0.5" />
      <circle cx="50" cy="70" r="1" fill="#fff" stroke="#ccc" stroke-width="0.5" />
      <circle cx="50" cy="85" r="1" fill="#fff" stroke="#ccc" stroke-width="0.5" />
      <!-- Left Pocket -->
      <path d="M28,42 L40,42 L40,56 L34,61 L28,56 Z" fill="#ffffff" stroke="#e6e6e6" stroke-width="0.5" />
    </svg>`
  },
  {
    id: "rm-check-blazer",
    name: "Earthy Tweed Plaid Blazer",
    category: "blazers",
    price: 299,
    rating: 4.6,
    reviews: 58,
    tags: ["Tweed Collection"],
    description: "An elegant, textured tweed blazer in olive green, brown, and ochre checks. Adds character and warmth to semi-formal attire.",
    features: ["Lambswool tweed blend", "Elbow patches in soft suede", "Notch lapels", "Flap pockets"],
    imageSvg: `<svg viewBox="0 0 100 120" class="prod-svg">
      <defs>
        <linearGradient id="g-tweed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4e5c46" />
          <stop offset="100%" stop-color="#2a3324" />
        </linearGradient>
        <pattern id="pat-plaid-prod" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 0,5 L 10,5 M 5,0 L 5,10" stroke="#705b38" stroke-width="0.5" opacity="0.4" />
          <path d="M 0,2.5 L 10,2.5 M 2.5,0 L 2.5,10" stroke="#a0824b" stroke-width="0.25" opacity="0.3" />
        </pattern>
      </defs>
      <!-- Jacket Outline -->
      <path d="M15,20 L35,12 L50,30 L65,12 L85,20 L80,95 L50,110 L20,95 Z" fill="url(#g-tweed)" />
      <path d="M15,20 L35,12 L50,30 L65,12 L85,20 L80,95 L50,110 L20,95 Z" fill="url(#pat-plaid-prod)" />
      <!-- Lapels -->
      <path d="M35,12 L50,55 L38,55 L35,32 L28,30 L35,12 Z" fill="#3a4534" stroke="#1d2419" stroke-width="0.5" />
      <path d="M65,12 L50,55 L62,55 L65,32 L72,30 L65,12 Z" fill="#3a4534" stroke="#1d2419" stroke-width="0.5" />
      <!-- Shirt v-neck -->
      <path d="M35,12 L50,55 L65,12 Z" fill="#ffffff" />
      <!-- Dark Blue Tie -->
      <path d="M47,20 L53,20 L54,48 L50,55 L46,48 Z" fill="#0f2042" />
      <!-- Collar -->
      <path d="M35,12 L50,20 L65,12 L50,13 Z" fill="#dbe1eb" />
      <!-- Leather Button -->
      <circle cx="49" cy="65" r="1.8" fill="#583c18" stroke="#3d2a10" stroke-width="0.5" />
      <circle cx="49" cy="78" r="1.8" fill="#583c18" stroke="#3d2a10" stroke-width="0.5" />
    </svg>`
  },
  {
    id: "rm-black-trousers",
    name: "Slim Fit Charcoal Trousers",
    category: "trousers",
    price: 129,
    rating: 4.7,
    reviews: 94,
    tags: ["Best Seller"],
    description: "Flat-front tailored trousers in charcoal grey wool blend. Features side adjusters and a clean break at the ankle.",
    features: ["Wool and stretch elastane blend", "Sleek metal side tab adjusters", "Slanted side pockets", "After-dinner split in rear waistband"],
    imageSvg: `<svg viewBox="0 0 100 120" class="prod-svg">
      <defs>
        <linearGradient id="g-trousers" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3a3a3a" />
          <stop offset="100%" stop-color="#1f1f1f" />
        </linearGradient>
      </defs>
      <!-- Trousers outline -->
      <path d="M25,10 L75,10 L78,25 L73,115 L52,115 L51,48 L49,48 L48,115 L27,115 L22,25 Z" fill="url(#g-trousers)" />
      <!-- Waistband details -->
      <path d="M25,10 L75,10 L76,18 L24,18 Z" fill="#2d2d2d" stroke="#1d1d1d" stroke-width="0.5" />
      <!-- Belt Loops -->
      <rect x="29" y="10" width="3" height="8" fill="#1d1d1d" />
      <rect x="39" y="10" width="3" height="8" fill="#1d1d1d" />
      <rect x="49" y="10" width="2" height="8" fill="#1d1d1d" />
      <rect x="58" y="10" width="3" height="8" fill="#1d1d1d" />
      <rect x="68" y="10" width="3" height="8" fill="#1d1d1d" />
      <!-- Crease lines -->
      <line x1="38" y1="18" x2="36" y2="115" stroke="#555" stroke-width="0.5" opacity="0.5" />
      <line x1="62" y1="18" x2="64" y2="115" stroke="#555" stroke-width="0.5" opacity="0.5" />
    </svg>`
  },
  {
    id: "rm-tan-cufflinks",
    name: "Handcrafted Leather Cufflinks",
    category: "accessories",
    price: 45,
    rating: 4.9,
    reviews: 42,
    tags: ["Limited Edition", "Real Leather"],
    description: "Premium full-grain tan Italian leather inserts, set in brushed gold-plated solid brass. Handmade by local artisans.",
    features: ["Genuine Italian tanned leather", "Solid brass with high-quality gold plating", "Bullet-back closure mechanism", "Comes in premium velvet box"],
    imageSvg: `<svg viewBox="0 0 100 120" class="prod-svg">
      <defs>
        <radialGradient id="g-gold" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fff1c5" />
          <stop offset="50%" stop-color="#d4af37" />
          <stop offset="100%" stop-color="#aa840c" />
        </radialGradient>
      </defs>
      <!-- Cufflink 1 -->
      <circle cx="35" cy="50" r="18" fill="url(#g-gold)" stroke="#806200" stroke-width="1" />
      <circle cx="35" cy="50" r="14" fill="#a0522d" stroke="#5c2e16" stroke-width="0.5" />
      <!-- Stitching details on leather insert -->
      <circle cx="35" cy="50" r="11" fill="none" stroke="#e3a078" stroke-width="0.75" stroke-dasharray="2,2.5" />

      <!-- Cufflink 2 -->
      <circle cx="68" cy="70" r="18" fill="url(#g-gold)" stroke="#806200" stroke-width="1" />
      <circle cx="68" cy="70" r="14" fill="#a0522d" stroke="#5c2e16" stroke-width="0.5" />
      <!-- Stitching details on leather insert -->
      <circle cx="68" cy="70" r="11" fill="none" stroke="#e3a078" stroke-width="0.75" stroke-dasharray="2,2.5" />
      
      <!-- Connective bar on Cufflink 2 showing perspective -->
      <path d="M50,70 L53,66 L53,74 Z" fill="url(#g-gold)" opacity="0.8" />
    </svg>`
  }
];

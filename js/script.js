let allProductsList = [];

// Dynamic Navbar Component
function renderNavbar() {
  const header = document.getElementById('navbar-component');
  if (!header) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  header.innerHTML = `
    <nav class="navbar">
      <a href="index.html" class="logo">Kirisan Medical</a>
      <ul class="nav-links" id="navlinks">
        <li><a href="index.html" class="${currentPath === 'index.html' || currentPath === '' ? 'active' : ''}">Home</a></li>
        <li><a href="products.html" class="${currentPath === 'products.html' ? 'active' : ''}">Products</a></li>
        <li><a href="about.html" class="${currentPath === 'about.html' ? 'active' : ''}">About</a></li>
        <li><a href="contact.html" class="${currentPath === 'contact.html' ? 'active' : ''}">Contact</a></li>
      </ul>
      <button class="mobile-toggle" id="menuToggle" aria-label="Toggle Navigation">☰</button>
    </nav>
  `;

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navlinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

// Dynamic Footer Component
function renderFooter() {
  const footer = document.getElementById('footer-component');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-container">
      <p>&copy; ${new Date().getFullYear()} Kirisan Medical. All rights reserved.</p>
      <ul class="footer-links">
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
  `;
}

// Open Lightbox for a specific product
function openLightbox(product) {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');

  if (!modal || !modalImg) return;

  const imageName = product.image ? product.image.trim() : 'placeholder.png';
  const initialSrc = encodeURI(`assets/images/${imageName}`);

  modalImg.src = initialSrc;
  if (modalCaption) modalCaption.textContent = product.Name;

  modal.classList.add('active');
}

// Auto-inject Modal HTML to Body and Setup Close Handlers
function setupModal() {
  if (!document.getElementById('image-modal')) {
    const modalHTML = `
      <div id="image-modal" class="modal">
        <span class="modal-close" id="modal-close">&times;</span>
        <div class="modal-container">
          <img class="modal-content" id="modal-img" alt="Enlarged product image">
          <div id="modal-caption" class="modal-caption"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const modal = document.getElementById('image-modal');
  const modalClose = document.getElementById('modal-close');

  const closeModal = () => modal.classList.remove('active');

  // Close via X button
  if (modalClose) modalClose.addEventListener('click', closeModal);

  // Close via click on empty space (overlay background)
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-container')) {
      closeModal();
    }
  });

  // Close via Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Helper function to create product card HTML
function createProductCard(product) {
  const imageName = product.image ? product.image.trim() : 'placeholder.png';
  const initialSrc = encodeURI(`assets/images/${imageName}`);

  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-image">
      <img 
        src="${initialSrc}" 
        alt="${product.Name}" 
        loading="lazy" 
        decoding="async" 
        width="200" 
        height="160"
        onerror="
          if (!this.dataset.triedJpg) {
            this.dataset.triedJpg = true;
            this.src = '${initialSrc.replace(/\.(png|webp)$/i, '.jpg')}';
          } else if (!this.dataset.triedPng) {
            this.dataset.triedPng = true;
            this.src = '${initialSrc.replace(/\.(jpg|jpeg|webp)$/i, '.png')}';
          } else {
            this.onerror = null;
            this.src = 'assets/images/placeholder.png';
          }
        "
      >
    </div>
    <div class="meta-tags">
      <span class="badge size-badge">${product.size}</span>
      <span class="badge flavour-badge">${product.flavour}</span>
    </div>
    <h3>${product.Name}</h3>
    <p class="product-description"><strong>${product.description}</strong></p>
    <p class="product-detail">${product.detail}</p>
  `;

  // Entire card triggers image pop-up
  card.addEventListener('click', () => {
    openLightbox(product);
  });

  return card;
}

// Dynamically populate the flavour dropdown options from the dataset
function populateFlavourOptions(products) {
  const flavourSelect = document.getElementById('flavour-filter');
  if (!flavourSelect) return;

  const flavours = [...new Set(products.map(p => p.flavour).filter(Boolean))];
  flavours.sort();

  flavourSelect.innerHTML = '<option value="all">All Flavours</option>';
  flavours.forEach(flavour => {
    const option = document.createElement('option');
    option.value = flavour.toLowerCase();
    option.textContent = flavour;
    flavourSelect.appendChild(option);
  });
}

// Main static filter function
function filterAndRenderProducts() {
  const allProductsContainer = document.getElementById('all-products');
  const noResultsElement = document.getElementById('no-results');
  if (!allProductsContainer) return;

  const searchInput = document.getElementById('search-input');
  const subcategorySelect = document.getElementById('subcategory-filter');
  const flavourSelect = document.getElementById('flavour-filter');

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const selectedSubcat = subcategorySelect ? subcategorySelect.value.toLowerCase() : 'all';
  const selectedFlavour = flavourSelect ? flavourSelect.value.toLowerCase() : 'all';

  const filtered = allProductsList.filter(product => {
    const nameMatch = product.Name ? product.Name.toLowerCase().includes(query) : false;
    const subcatMatch = product.subcategory ? product.subcategory.toLowerCase().includes(query) : false;
    const flavourMatch = product.flavour ? product.flavour.toLowerCase().includes(query) : false;
    const sizeMatch = product.size ? product.size.toLowerCase().includes(query) : false;

    const matchesQuery = !query || nameMatch || subcatMatch || flavourMatch || sizeMatch;
    const matchesSubcategory = selectedSubcat === 'all' || 
      (product.subcategory && product.subcategory.toLowerCase() === selectedSubcat);
    const matchesFlavour = selectedFlavour === 'all' || 
      (product.flavour && product.flavour.toLowerCase() === selectedFlavour);

    return matchesQuery && matchesSubcategory && matchesFlavour;
  });

  allProductsContainer.innerHTML = '';

  if (filtered.length === 0) {
    if (noResultsElement) noResultsElement.style.display = 'block';
  } else {
    if (noResultsElement) noResultsElement.style.display = 'none';
    filtered.forEach(product => {
      allProductsContainer.appendChild(createProductCard(product));
    });
  }
}

// Attach event listeners to filter controls
function setupFilterListeners() {
  const searchInput = document.getElementById('search-input');
  const subcategorySelect = document.getElementById('subcategory-filter');
  const flavourSelect = document.getElementById('flavour-filter');

  if (searchInput) searchInput.addEventListener('input', filterAndRenderProducts);
  if (subcategorySelect) subcategorySelect.addEventListener('change', filterAndRenderProducts);
  if (flavourSelect) flavourSelect.addEventListener('change', filterAndRenderProducts);
}

// Fetch and Render Products from JSONL
async function loadProductsFromJSONL() {
  const featuredContainer = document.getElementById('featured-products');
  const allProductsContainer = document.getElementById('all-products');

  if (!featuredContainer && !allProductsContainer) return;

  try {
    const response = await fetch('data/products.jsonl');
    const text = await response.text();

    allProductsList = text
      .trim()
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => JSON.parse(line));

    if (featuredContainer) {
      featuredContainer.innerHTML = '';
      allProductsList.slice(0, 6).forEach(product => {
        featuredContainer.appendChild(createProductCard(product));
      });
    }

    if (allProductsContainer) {
      populateFlavourOptions(allProductsList);
      setupFilterListeners();
      filterAndRenderProducts();
    }

  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  setupModal();
  loadProductsFromJSONL();
});
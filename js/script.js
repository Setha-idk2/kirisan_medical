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

// Helper function to create product card HTML
function createProductCard(product) {
  const imageSrc = product.image ? `assets/images/${product.image}` : 'assets/images/placeholder.png';
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-image">
      <img src="${imageSrc}" alt="${product.Name}" loading="lazy">
    </div>
    <div class="meta-tags">
      <span class="badge size-badge">${product.size}</span>
      <span class="badge flavour-badge">${product.flavour}</span>
      ${product.price ? `<span class="badge price-badge">${product.price}</span>` : ''}
    </div>
    <h3>${product.Name}</h3>
    <p class="product-description"><strong>${product.description}</strong></p>
    <p class="product-detail">${product.detail}</p>
  `;
  return card;
}

// Fetch and Render Products from JSONL
async function loadProductsFromJSONL() {
  const featuredContainer = document.getElementById('featured-products');
  const allProductsContainer = document.getElementById('all-products');

  if (!featuredContainer && !allProductsContainer) return;

  try {
    const response = await fetch('data/products.jsonl');
    const text = await response.text();

    const products = text
      .trim()
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => JSON.parse(line));

    // Render 6 featured products on Home Page
    if (featuredContainer) {
      featuredContainer.innerHTML = '';
      products.slice(0, 6).forEach(product => {
        featuredContainer.appendChild(createProductCard(product));
      });
    }

    // Render all products together on Products Page
    if (allProductsContainer) {
      allProductsContainer.innerHTML = '';
      products.forEach(product => {
        allProductsContainer.appendChild(createProductCard(product));
      });
    }

  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  loadProductsFromJSONL();
});
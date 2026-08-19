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

// Fetch and Render Products from JSONL
async function loadProductsFromJSONL() {
  const containers = {
    'toothpaste-adult': document.getElementById('adult-toothpaste-products'),
    'toothpaste-child': document.getElementById('child-toothpaste-products')
  };

  // Only run loading logic if product grid containers exist on the page
  const hasContainers = Object.values(containers).some(c => c !== null);
  if (!hasContainers) return;

  try {
    const response = await fetch('data/products.jsonl');
    const text = await response.text();

    const products = text
      .trim()
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => JSON.parse(line));

    Object.values(containers).forEach(c => { if (c) c.innerHTML = ''; });

    products.forEach(product => {
      const key = `${product.category}-${product.subcategory}`;
      const targetContainer = containers[key];

      if (targetContainer) {
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
          </div>
          <h3>${product.Name}</h3>
          <p>${product.description}</p>
        `;
        targetContainer.appendChild(card);
      }
    });

    enableMouseDrag();

  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

// Drag Scroll Helper
function enableMouseDrag() {
  const containers = document.querySelectorAll('.product-grid.scroll-x');

  containers.forEach((container) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('dragging');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('dragging');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('dragging');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  loadProductsFromJSONL();
});
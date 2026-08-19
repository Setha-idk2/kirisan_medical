// Render Navbar
function renderNavbar() {
  const header = document.getElementById('navbar-component');
  if (!header) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const isHomePage = currentPath === 'index.html' || currentPath === '';

  const homeLink = isHomePage ? '#home' : 'index.html#home';
  const productsLink = isHomePage ? '#products' : 'index.html#products';

  header.innerHTML = `
    <nav class="navbar">
      <a href="${homeLink}" class="logo">Kirisan Group</a>
      <ul class="nav-links" id="navlinks">
        <li><a href="${homeLink}">Home</a></li>
        <li><a href="${productsLink}">Products</a></li>
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

// Render Footer
function renderFooter() {
  const footer = document.getElementById('footer-component');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-container">
      <p>&copy; ${new Date().getFullYear()} Kirisan Group. All rights reserved.</p>
      <ul class="footer-links">
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
  `;
}

// Fetch and Render Products with Automated Image Paths
async function loadProductsFromJSONL() {
  const dogContainer = document.getElementById('dog-products');
  if (!dogContainer) return;

  try {
    const response = await fetch('data/products.jsonl');
    const text = await response.text();

    const products = text
      .trim()
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => JSON.parse(line));

    const containers = {
      'pet-food-dog': document.getElementById('dog-products'),
      'pet-food-cat': document.getElementById('cat-products'),
      'toothpaste-adult': document.getElementById('adult-toothpaste-products'),
      'toothpaste-child': document.getElementById('child-toothpaste-products')
    };

    Object.values(containers).forEach(c => { if (c) c.innerHTML = ''; });

    products.forEach(product => {
      const key = `${product.category}-${product.subcategory}`;
      const targetContainer = containers[key];

      if (targetContainer) {
        // Automatically prepends the images folder path
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
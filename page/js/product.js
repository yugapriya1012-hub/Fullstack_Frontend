let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = []; 

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function updateCartUI() {
    const cartDot = document.getElementById('cartDot');
    if(cartDot) {
        cartDot.style.display = cart.length > 0 ? 'inline' : 'none';
    }
}

function highlightCart() {
    const cartWrapper = document.getElementById('cartWrapper');
    cartWrapper.classList.add('highlight-cart');
    
    setTimeout(() => cartWrapper.classList.remove('highlight-cart'), 500);
}

function addToCart(product) {
    const exists = cart.some(item => item.id === product.id);
    if (!exists) {
        cart.push({ ...product, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showToast(`${product.name} added to cart!`);
    } else {
        showToast("Item is already in your cart!");
    }
    highlightCart();
}

async function loadProducts() {
    try {
        const response = await fetch('http://127.0.0.1:8000/products/');
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

function displayProducts(products) {
    const grid = document.getElementById('productGrid');
    const noResults = document.getElementById('noResults');
    
    grid.innerHTML = '';
    grid.appendChild(noResults);

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const locationTerm = document.getElementById('locationFilter').value.toLowerCase();
    const showOutOfStock = document.getElementById('stockFilter').checked;

    let visibleCount = 0;

    products.forEach(product => {
        const matchesSearch = product.product_name.toLowerCase().includes(searchTerm) || 
                             product.seller_name.toLowerCase().includes(searchTerm);
        const matchesLocation = locationTerm === 'all' || product.places.toLowerCase().includes(locationTerm);
        const isOutOfStock = product.stock <= 0; 
        const shouldShow = matchesSearch && matchesLocation && (showOutOfStock || !isOutOfStock);

        if (shouldShow) {
            visibleCount++;
            const imageUrl = `http://127.0.0.1:8000/images/products/${product.image}`;
            const card = document.createElement('div');
            card.className = `product-card ${isOutOfStock ? 'out-of-stock' : ''}`;
            
            card.innerHTML = `
                <img src="${imageUrl}" alt="${product.product_name}">
                <div class="card-content">
                    <h3>${product.product_name}</h3>
                    <p>${product.description}</p>
                    <div class="price-row">
                        <span class="price">Rs.${product.price.toFixed(2)}</span>
                        <div class="seller-info">📍 ${product.places} | By ${product.seller_name}</div>
                        <button class="add-btn" ${isOutOfStock ? 'disabled' : ''}>
                            ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            `;

            if (!isOutOfStock) {
    card.querySelector('.add-btn').addEventListener('click', () => {
        const finalId = product.id || product.product_id; 
        
        if (!finalId) {
            console.error("Error: Product ID is missing from API response!");
            showToast("Error: Could not add product.");
            return;
        }

        addToCart({
            id: finalId, 
            name: product.product_name,
            price: product.price,
            image: imageUrl,
            seller_id: product.seller_id  
        });
    });
}
            grid.appendChild(card);
        }
    });

    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

document.getElementById('searchInput').addEventListener('input', () => displayProducts(allProducts));
document.getElementById('locationFilter').addEventListener('change', () => displayProducts(allProducts));
document.getElementById('stockFilter').addEventListener('change', () => displayProducts(allProducts));

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartUI();
});
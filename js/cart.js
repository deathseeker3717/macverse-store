
// ============================================
// CART SYSTEM
// ============================================

// Get cart from localStorage or initialize empty array
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productName, price, imagePath) {
    const cart = getCart();
    
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            image: imagePath || 'images/products/default.jpeg',
            quantity: 1
        });
    }
    
    saveCart(cart);
    showNotification(`☑️ ${productName} added to cart! `);
    updateCartCount();
}

// Show notification when item added
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Update cart count in navigation
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Remove item from cart
function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
}

// Load and display cart items (for checkout.html)
function loadCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartContentWrapper = document.querySelector('.cart-content-wrapper');
    
    if (!cartItemsContainer) return; 
    
    if (cart.length === 0) {
        cartContentWrapper.style.display = 'none';
        cartEmpty.style.display = 'block';
        const cartHeader = document.querySelector('.cart-header');
        if (cartHeader) cartHeader.style.display = 'none';
        return;
    }
    
    cartContentWrapper.style.display = 'grid';
    cartEmpty.style.display = 'none';

    const cartHeader = document.querySelector('.cart-header');
    if (cartHeader) cartHeader.style.display = 'block';
    
    cartItemsContainer.innerHTML = '';
    
    // Add each cart item
    cart.forEach((item, index) => {
        const cartItemHTML = `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-option">Quantity: ${item.quantity}</p>
                    <p class="cart-item-price">$${(item.price * item.quantity).toLocaleString()}</p>
                    <button class="cart-item-remove" onclick="removeItem(${index})">Remove</button>
                    <div class="cart-item-delivery">
                        <p><strong>Find out how soon you can get this item.</strong> <a href="#">Enter zip code</a></p>
                        <p class="delivery-status">In stock and ready to ship. Pick up at a MacVerse Store near you.</p>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItemHTML;
    });
    
    updateCartTotal();
}

// Update cart totals
function updateCartTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const formattedTotal = '$' + subtotal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    const cartTotal = document.getElementById('cart-total');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (cartTotal) cartTotal.textContent = formattedTotal;
    if (subtotalEl) subtotalEl.textContent = formattedTotal;
    if (totalEl) totalEl.textContent = formattedTotal;
}

// Load cart when checkout page loads
if (document.getElementById('cart-items')) {
    loadCart();
}

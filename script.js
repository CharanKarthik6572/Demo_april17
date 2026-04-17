// Food menu data with real images
const menuItems = [
    { id: 1, name: 'Margherita Pizza', price: 250, category: 'pizza', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop', description: 'Fresh tomatoes, mozzarella, basil', rating: 4.5 },
    { id: 2, name: 'Pepperoni Pizza', price: 300, category: 'pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=300&fit=crop', description: 'Pepperoni, cheese, tomato sauce', rating: 4.7 },
    { id: 3, name: 'Classic Burger', price: 180, category: 'burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', description: 'Beef patty, lettuce, tomato, cheese', rating: 4.3 },
    { id: 4, name: 'Cheese Burger', price: 200, category: 'burger', image: 'https://images.unsplash.com/photo-1550547990-250bc66d4d16?w=400&h=300&fit=crop', description: 'Double cheese, beef patty, special sauce', rating: 4.6 },
    { id: 5, name: 'Coca Cola', price: 60, category: 'drink', image: 'https://images.unsplash.com/photo-1554866585-22da12462d6f?w=400&h=300&fit=crop', description: 'Refreshing carbonated drink', rating: 4.2 },
    { id: 6, name: 'Chocolate Cake', price: 150, category: 'dessert', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop', description: 'Rich chocolate cake with frosting', rating: 4.8 },
    { id: 7, name: 'Spicy Wings', price: 220, category: 'pizza', image: 'https://images.unsplash.com/photo-1608424849621-e3d9a68e97b0?w=400&h=300&fit=crop', description: 'Spicy chicken wings with dip', rating: 4.4 },
    { id: 8, name: 'Veggie Burger', price: 160, category: 'burger', image: 'https://images.unsplash.com/photo-1587159475223-0dd0ffc1c21f?w=400&h=300&fit=crop', description: 'Plant-based patty, fresh veggies', rating: 4.1 }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    displayPopularFoods();
    displayMenuFoods();
    updateCartCount();
    setupEventListeners();
    loadCartFromStorage();
    setupScrollToTop();
});

// Display popular foods (first 4 items)
function displayPopularFoods() {
    const popularContainer = document.getElementById('popular-foods');
    const popularItems = menuItems.slice(0, 4);

    popularContainer.innerHTML = popularItems.map(item => createFoodCard(item)).join('');
}

// Display menu foods
function displayMenuFoods(items = menuItems) {
    const menuContainer = document.getElementById('menu-foods');
    menuContainer.innerHTML = items.map(item => createFoodCard(item)).join('');
}

// Create food card HTML
function createFoodCard(item) {
    const isFavorite = favorites.includes(item.id);
    return `
        <div class="food-card">
            <img src="${item.image}" alt="${item.name}">
            <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" onclick="toggleFavorite(${item.id})">
                <i class="fas fa-heart"></i>
            </button>
            <div class="food-card-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="food-rating">
                    <span class="stars">${'★'.repeat(Math.floor(item.rating))}${'☆'.repeat(5 - Math.floor(item.rating))}</span>
                    <span>${item.rating}</span>
                </div>
                <div class="price">₹${item.price}</div>
                <button class="add-to-cart" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
        </div>
    `;
}

// Toggle favorite
function toggleFavorite(itemId) {
    const index = favorites.indexOf(itemId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(itemId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayPopularFoods();
    displayMenuFoods();
}

// Add to cart
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    const existingItem = cart.find(cartItem => cartItem.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCartCount();
    saveCartToStorage();
    showToast('Item added to cart!');
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
    if (cartSidebar.classList.contains('open')) {
        displayCartItems();
    }
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <div>₹${item.price * item.quantity}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

// Change quantity
function changeQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartCount();
    saveCartToStorage();
    displayCartItems();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    saveCartToStorage();
    displayCartItems();
}

// Show checkout
function showCheckout() {
    document.getElementById('cart-sidebar').classList.remove('open');
    scrollToSection('checkout');
}

// Search functionality
function searchItems() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm)
    );
    displayMenuFoods(filteredItems);
}

// Filter by category
function filterByCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    let filteredItems = menuItems;
    if (category !== 'all') {
        filteredItems = menuItems.filter(item => item.category === category);
    }
    displayMenuFoods(filteredItems);
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('search').addEventListener('input', searchItems);
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => filterByCategory(btn.dataset.category));
    });
    document.getElementById('checkout-form').addEventListener('submit', handleOrderSubmit);
}

// Handle order submit
function handleOrderSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Generate order ID
    const orderId = 'ORD' + Date.now();

    // Show success modal
    document.getElementById('order-id').textContent = orderId;
    document.getElementById('order-modal').style.display = 'block';

    // Clear cart
    cart = [];
    updateCartCount();
    saveCartToStorage();
    displayCartItems();

    // Reset form
    event.target.reset();
}

// Close modal
function closeModal() {
    document.getElementById('order-modal').style.display = 'none';
}

// Show toast
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Scroll to section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Setup scroll to top
function setupScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Local storage functions
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
}

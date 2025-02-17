// Global variables
let menuItems = [];
const categories = ['pizza', 'salads', 'burgers', 'appetizers', 'desserts', 'drinks'];

// Fetch and display menu items
async function fetchMenu() {
    try {
        const response = await fetch('/api/menu');
        menuItems = await response.json();
        displayMenu(menuItems);
        setupEventListeners();
    } catch (error) {
        console.error('Error fetching menu:', error);
        showError('Failed to load menu items');
    }
}

// Get image URL based on menu item
function getImageForItem(item) {
    const images = {
        // Pizza
        'Pepperoni Pizza': 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
        'BBQ Chicken Pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
        'Margherita Pizza':'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        
        // Salads
        'Caesar Salad': 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
        'Greek Salad': 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
        
        // Burgers
        'Cheeseburger': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90',
        'Chicken Burger': 'https://images.unsplash.com/photo-1615297928064-24977384d0da',
        'Classic Burger': 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        // Appetizers
        'French Fries': 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d',
        'Mozzarella Sticks': 'https://plus.unsplash.com/premium_photo-1714245922665-1f042e694f47?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        
        // Desserts
        'Chocolate Cake': 'https://images.unsplash.com/photo-1713274784123-8cc98366670e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'Cheesecake': 'https://images.unsplash.com/photo-1724952727574-49fe24cd5dcc?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        
        // Drinks
        'Espresso': 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'Iced Tea': 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'Cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
        'Fresh Orange Juice': 'https://plus.unsplash.com/premium_photo-1667543228378-ec4478ab2845?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    };
    return images[item.name] || 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65';
}

// Display menu items
function displayMenu(items) {
    const menuContainer = document.getElementById('menu');
    if (!menuContainer) return;

    menuContainer.innerHTML = items.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <img src="${getImageForItem(item)}" alt="${item.name}" class="menu-item-image">
            <div class="menu-item-content">
                <h3 class="menu-item-title">${item.name}</h3>
                <span class="menu-item-category">${capitalizeFirst(item.category)}</span>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-price">$${item.price.toFixed(2)}</div>
                ${isLoggedIn() ? 
                    `<button onclick="orderItem('${item._id}')" class="btn btn-primary">
                        <i class="fas fa-shopping-cart"></i> Order Now
                    </button>` : 
                    `<button onclick="location.href='login.html'" class="btn btn-secondary">
                        <i class="fas fa-sign-in-alt"></i> Login to Order
                    </button>`
                }
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredItems = menuItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm)
            );
            displayMenu(filteredItems);
        });
    }

    // Category filters
    document.querySelectorAll('.category-filter').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.category-filter').forEach(btn => 
                btn.classList.remove('active')
            );
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter menu items
            const category = button.dataset.category;
            const filteredItems = category ? 
                menuItems.filter(item => item.category.toLowerCase() === category.toLowerCase()) :
                menuItems;
            
            displayMenu(filteredItems);
        });
    });
}

// Order item
async function orderItem(itemId) {
    if (!isLoggedIn()) {
        location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                items: [itemId]
            })
        });

        if (response.ok) {
            showSuccess('Order placed successfully!');
            setTimeout(() => {
                location.href = 'orders.html';
            }, 1500);
        } else {
            const data = await response.json();
            showError(data.message || 'Failed to place order');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showError('An error occurred while placing the order');
    }
}

// Helper functions
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        // User is logged in
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('registerBtn').style.display = 'none';
        document.getElementById('myOrdersBtn').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'block';
    } else {
        // User is not logged in
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('registerBtn').style.display = 'block';
        document.getElementById('myOrdersBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showSuccess(message) {
    // Implement toast notification
    alert(message);
}

function showError(message) {
    // Implement toast notification
    alert(message);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
    checkLoginStatus();
    
    // Logout button click handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

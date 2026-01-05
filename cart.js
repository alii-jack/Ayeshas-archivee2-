document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckout = document.querySelector('.close-checkout');
    const placeOrderBtn = document.querySelector('.place-order-btn');
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart display
    function updateCartDisplay() {
        // Update cart count
        cartCount.textContent = cart.length;
        
        // Update cart items display
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            cartTotal.textContent = '₨ 0';
        } else {
            let itemsHTML = '';
            let total = 0;
            
            cart.forEach((item, index) => {
                itemsHTML += `
                    <div class="cart-item">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">₨ ${item.price}</div>
                        </div>
                        <button class="remove-item" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                total += parseInt(item.price.replace(/,/g, ''));
            });
            
            cartItemsContainer.innerHTML = itemsHTML;
            cartTotal.textContent = `₨ ${total.toLocaleString()}`;
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Add item to cart
    function addToCart(name, price) {
        // Remove currency symbol and commas
        const cleanPrice = price.replace(/[^0-9]/g, '');
        
        // Add item to cart
        cart.push({
            name: name,
            price: parseInt(cleanPrice).toLocaleString()
        });
        
        // Update display
        updateCartDisplay();
        
        // Show cart automatically
        setTimeout(() => {
            showCart();
        }, 300);
    }
    
    // Remove item from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartDisplay();
    }
    
    // Show cart modal
    function showCart() {
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Hide cart modal
    function hideCart() {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Show checkout modal
    function showCheckout() {
        hideCart();
        checkoutModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Hide checkout modal
    function hideCheckout() {
        checkoutModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Event Listeners
    cartIcon.addEventListener('click', showCart);
    closeCart.addEventListener('click', hideCart);
    checkoutBtn.addEventListener('click', showCheckout);
    closeCheckout.addEventListener('click', hideCheckout);
    placeOrderBtn.addEventListener('click', function() {
        // Get selected payment method
        const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
        
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }
        
        // Get order summary
        let orderSummary = 'Order Summary:\n\n';
        let total = 0;
        
        cart.forEach(item => {
            orderSummary += `${item.name} - ₨ ${item.price}\n`;
            total += parseInt(item.price.replace(/,/g, ''));
        });
        
        orderSummary += `\nTotal: ₨ ${total.toLocaleString()}\n`;
        orderSummary += `Payment Method: ${selectedPayment.nextElementSibling.textContent}\n\n`;
        orderSummary += 'Please send your payment details to:\n';
        orderSummary += 'Email: ayeshajamilrao891@gmail.com\n';
        orderSummary += 'Phone: +923467942497';
        
        // Send email
        const subject = 'New Order from Ayeshas Archivee2';
        const body = encodeURIComponent(orderSummary);
        window.location.href = `mailto:ayeshajamilrao891@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        
        // Clear cart
        cart = [];
        updateCartDisplay();
        hideCheckout();
        
        alert('Order placed successfully! Please check your email to send payment details.');
    });
    
    // Add to cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            addToCart(name, `₨ ${parseInt(price).toLocaleString()}`);
            
            // Button animation
            this.textContent = 'Added! ✓';
            this.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '';
            }, 1500);
        });
    });
    
    // Cart items container - event delegation for remove buttons
    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.closest('.remove-item')) {
            const index = parseInt(e.target.closest('.remove-item').getAttribute('data-index'));
            removeFromCart(index);
        }
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            hideCart();
        }
        if (e.target === checkoutModal) {
            hideCheckout();
        }
    });
    
    // Close modals with ESC key
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideCart();
            hideCheckout();
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Form submission
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const order = document.getElementById('order').value;
            const payment = document.getElementById('payment').value;
            
            // Create order summary
            let orderSummary = `New Order from Ayeshas Archivee2\n\n`;
            orderSummary += `Customer Name: ${name}\n`;
            orderSummary += `Email: ${email}\n`;
            orderSummary += `Phone: ${phone}\n`;
            orderSummary += `Address: ${address}\n\n`;
            orderSummary += `Order Details:\n${order}\n\n`;
            orderSummary += `Payment Method: ${payment === 'cod' ? 'Cash on Delivery' : 
                           payment === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'}\n\n`;
            
            orderSummary += 'Please contact the customer to confirm the order and payment details.';
            
            // Send email
            const subject = `Order from ${name}`;
            const body = encodeURIComponent(orderSummary);
            window.location.href = `mailto:ayeshajamilrao891@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
            
            // Reset form
            orderForm.reset();
            alert('Order submitted successfully! Please check your email to send payment details.');
        });
    }
    
    // Initialize cart display
    updateCartDisplay();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {
    function addToCart(item, price, image, description, restaurantName, restaurantAddress, quantity = 1) {
        const userData = JSON.parse(localStorage.getItem('loggedInUser'));
        const userEmail = userData ? userData.email : null;

        if (!userEmail) {
            alert('Please log in to add items to the cart.');
            return;
        }

        alert(`${item} added to cart`);
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItemIndex = cart.findIndex(cartItem => cartItem.item === item && cartItem.userEmail === userEmail);

        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ item, price, image, description, restaurantName, restaurantAddress, quantity, userEmail });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    window.addToCart = addToCart;
});

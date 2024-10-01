document.addEventListener("DOMContentLoaded", function() {
    const searchicon1 = document.querySelector('#searchicon1');
    const search1 = document.querySelector('#searchinput1');
    searchicon1.addEventListener('click', function() {
        search1.style.display = 'flex';
        searchicon1.style.display = 'none';
    });

    const searchicon2 = document.querySelector('#searchicon2');
    const search2 = document.querySelector('#searchinput2');
    searchicon2.addEventListener('click', function() {
        search2.style.display = 'flex';
        searchicon2.style.display = 'none';
    });

    const bar = document.querySelector('.fa-bars');
    const cross = document.querySelector('#hdcross');
    const headerbar = document.querySelector('.headerbar');

    bar.addEventListener('click', function() {
        setTimeout(() => {
            cross.style.display = 'block';
        }, 200);
        headerbar.style.right = '0%';
    });

    cross.addEventListener('click', function() {
        cross.style.display = 'none';
        headerbar.style.right = '-100%'; 
    });

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

document.addEventListener("DOMContentLoaded", function () {
    const mobileMenu = document.getElementById("mobile-menu");
    const sidebar = document.getElementById("mySidebar");
    const closeBtn = document.getElementById("closeBtn");

    mobileMenu.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    
    
    const changeAddressButton = document.getElementById("change-address");
    const changeAddressForm = document.getElementById("change-address-form");
    const applyChangesButton = document.getElementById("apply-changes");
    const addressDisplayContainer = document.getElementById("current-address-container");
    const addressDisplay = document.getElementById("current-address");
    const placeOrderButton = document.getElementById("place-order-btn");
    const cartErrorMessage = document.getElementById("cart-error-message");
    const userAddressInput = document.getElementById("user-address");

    // Assume the user email is stored in local storage with the key 'userEmail'
    const userData = JSON.parse(localStorage.getItem('loggedInUser'));
        const userEmail = userData ? userData.email : null;

        if (!userEmail) {
            alert('Please log in to add items to the cart.');
            return;
        }
    

    // Hide the address form initially
    changeAddressForm.style.display = "none";

    // Show the address form when clicking the "Change" button
    changeAddressButton.addEventListener("click", function () {
        addressDisplayContainer.style.display = "none";
        changeAddressForm.style.display = "block";
    });

    const stateCityMapping = {
        tamilnadu: ["Chennai", "Coimbatore"],
    };

    const cityLocalityMapping = {
        chennai: ["Tnagar", "Adayar"],
        coimbatore: ["RS Puram", "Kalapatti"]
    };

    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');
    const localitySelect = document.getElementById('locality');

    stateSelect.addEventListener('change', function () {
        const state = stateSelect.value;
        if (state) {
            citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';
            stateCityMapping[state].forEach(city => {
                citySelect.innerHTML += `<option value="${city.toLowerCase()}">${city}</option>`;
            });
            citySelect.disabled = false;
            citySelect.classList.remove('disabled');
        } else {
            citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';
            citySelect.disabled = true;
            citySelect.classList.add('disabled');
            localitySelect.innerHTML = '<option value="" disabled selected>Select Locality</option>';
            localitySelect.disabled = true;
            localitySelect.classList.add('disabled');
        }
    });

    citySelect.addEventListener('change', function () {
        const city = citySelect.value;
        if (city) {
            localitySelect.innerHTML = '<option value="" disabled selected>Select Locality</option>';
            cityLocalityMapping[city].forEach(locality => {
                localitySelect.innerHTML += `<option value="${locality.toLowerCase()}">${locality}</option>`;
            });
            localitySelect.disabled = false;
            localitySelect.classList.remove('disabled');
        } else {
            localitySelect.innerHTML = '<option value="" disabled selected>Select Locality</option>';
            localitySelect.disabled = true;
            localitySelect.classList.add('disabled');
        }
    });

    applyChangesButton.addEventListener("click", function () {
        const state = stateSelect.value;
        const city = citySelect.value;
        const locality = localitySelect.value;
        const address = document.getElementById('address').value.trim();
        const pincode = document.getElementById('pincode').value.trim();

        let isValid = true;

        if (!state) {
            document.getElementById('state-error').textContent = 'Please select state';
            document.getElementById('state-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('state-error').style.display = 'none';
        }

        if (!city) {
            document.getElementById('city-error').textContent = 'Please select city';
            document.getElementById('city-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('city-error').style.display = 'none';
        }

        if (!locality) {
            document.getElementById('locality-error').textContent = 'Please select locality';
            document.getElementById('locality-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('locality-error').style.display = 'none';
        }

        if (!address) {
            document.getElementById('address-error').textContent = 'Please enter the address';
            document.getElementById('address-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('address-error').style.display = 'none';
        }

        if (!/^\d{6}$/.test(pincode)) {
            document.getElementById('pincode-error').textContent = 'Please enter a valid 6-digit pincode';
            document.getElementById('pincode-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('pincode-error').style.display = 'none';
        }

        if (isValid) {
            const fullAddress = `${address}, ${locality}, ${city}-${pincode}, ${state}`;
            addressDisplay.innerHTML = `<p>${fullAddress.replace(/,\s*/g, ',<br>')}</p>`;
            userAddressInput.value = fullAddress;

            // Save the address to local storage with the user email as the key
            localStorage.setItem(`${userEmail}_address`, fullAddress);

            changeAddressForm.style.display = "none";
            addressDisplayContainer.style.display = "block";
        }
    });

    // Function to update cart display
    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById("cart-items");
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartItemsContainer.innerHTML = "";

        let subTotal = 0;

        cart.filter(item => item.userEmail === userEmail).forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");

            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.item}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.item}</div>
                    <div class="cart-item-description">${item.description}</div>
                    <div class="cart-item-restaurant">From: ${item.restaurantName}, ${item.restaurantAddress}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${index}, -1)">
                            ${item.quantity > 1 ? '-' : '<i class="fas fa-trash-alt"></i>'}
                        </button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </div>
            `;

            cartItemsContainer.appendChild(itemElement);
            subTotal += item.price * item.quantity;
        });

        const subTotalElement = document.querySelector("#sub-total");
        const taxesElement = document.querySelector("#taxes-charges");
        const grandTotalElement = document.querySelector("#grand-total");

        subTotalElement.textContent = "Rs. " + subTotal.toFixed(2);
        const taxes = subTotal * 0.05; // Assuming 5% tax rate
        taxesElement.textContent = "Rs. " + taxes.toFixed(2);
        const discount = 0.0; // Assuming no discount for now
        const grandTotal = subTotal + taxes - discount; // Adjust as necessary
        grandTotalElement.textContent = "Rs. " + grandTotal.toFixed(2);
    }

    window.changeQuantity = function (index, change) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const userCart = cart.filter(item => item.userEmail === userEmail);

        if (userCart[index].quantity + change <= 0) {
            cart = cart.filter((item, i) => !(i === index && item.userEmail === userEmail));
        } else {
            userCart[index].quantity += change;
            cart = cart.map((item, i) => (item.userEmail === userEmail && i === index ? userCart[index] : item));
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    };

    // Place order button click event
    placeOrderButton.addEventListener("click", function () {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const userCart = cart.filter(item => item.userEmail === userEmail);

        if (userCart.length === 0) {
            cartErrorMessage.style.display = "block";
        } else {
            const userAddress = addressDisplay.innerHTML;
            const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];
            const orderId = pastOrders.length + 1;
            const orderDate = new Date().toLocaleDateString();
            const orderTime = new Date().toLocaleTimeString();
            const subTotal = parseFloat(document.querySelector("#sub-total").textContent.replace("Rs. ", ""));
            const taxes = parseFloat(document.querySelector("#taxes-charges").textContent.replace("Rs. ", ""));
            const discount = 0; // Assuming no discount for now
            const grandTotal = parseFloat(document.querySelector("#grand-total").textContent.replace("Rs. ", ""));

            const order = {
                id: orderId,
                date: orderDate,
                time: orderTime,
                items: userCart,
                subTotal: subTotal,
                discount: discount,
                taxes: taxes,
                grandTotal: grandTotal,
                userAddress: userAddress,
                userEmail: userEmail
            };

            pastOrders.push(order);
            localStorage.setItem("pastOrders", JSON.stringify(pastOrders));
            localStorage.setItem("cart", JSON.stringify(cart.filter(item => item.userEmail !== userEmail)));

            updateCartDisplay();
            alert("Order successfully placed!");
        }
    });

    // Initialize cart display
    updateCartDisplay();
});

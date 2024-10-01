const stateCityMapping = {
    tamilnadu: ["Chennai", "Coimbatore"],
    delhi: ["City1", "City2"],
    kerala: ["Kochi", "Palakad"]
};

const cityLocalityMapping = {
    chennai: ["Locality1", "Locality2", "Locality3", "Locality4"],
    coimbatore: ["Locality5", "Locality6", "Locality7", "Locality8"],
    city1: ["Locality9", "Locality10", "Locality11", "Locality12"],
    city2: ["Locality13", "Locality14", "Locality15", "Locality16"],
    kochi: ["Locality17", "Locality18", "Locality19"],
    palakad: ["Locality21", "Locality22", "Locality23", "Locality24"]
};

document.addEventListener('DOMContentLoaded', () => {

    const pastOrdersSection = document.getElementById('past-orders-section');
    const editProfileSection = document.getElementById('edit-profile-section');
    const profileGreeting = document.getElementById('profile-greeting');

    const stateSelect = document.getElementById('edit-state');
    const citySelect = document.getElementById('edit-city');
    const localitySelect = document.getElementById('edit-locality');

    // Populate state dropdown
    for (let state in stateCityMapping) {
        stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
    }

    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('loggedInUser'));
    if (userData) {
        profileGreeting.textContent = `Hello, ${userData.firstName}`;
        displayProfileData(userData);
        renderPastOrders(userData.email); // Fetch and render past orders for the logged-in user
    }

    function renderPastOrders(userEmail) {
        const pastOrders = JSON.parse(localStorage.getItem('pastOrders')) || [];
        const userOrders = pastOrders.filter(order => order.userEmail === userEmail);

        if (userOrders.length === 0) {
            pastOrdersSection.innerHTML = '<p>No past orders found.</p>';
            return;
        }

        pastOrdersSection.innerHTML = userOrders.map(order => {
            const grandTotal = order.grandTotal !== undefined ? order.grandTotal.toFixed(2) : 'N/A';
            const subTotal = order.subTotal !== undefined ? order.subTotal.toFixed(2) : 'N/A';
            const taxes = order.taxes !== undefined ? order.taxes.toFixed(2) : 'N/A';
            const discount = order.discount !== undefined ? order.discount.toFixed(2) : 'N/A';
            const itemsHtml = order.items.map(item => `
                <p>${item.item} x${item.quantity}</p>
            `).join('');

            return `
                <div class="order">
                    <div class="order-summary">
                        <img src="${order.items[0].image}" alt="${order.items[0].item}">
                        <div class="order-details">
                            <h3>${order.items[0].restaurantName}</h3>
                            <p> ${order.items[0].restaurantAddress}</p>
                            <p>Ordered on ${order.date} at ${order.time}</p>
                        </div>
                        <p id="totalpaid">Total Paid: ₹${grandTotal}</p>
                    </div>
                    <div class="order-items">
                        ${itemsHtml}
                    </div>
                    <div class="order-actions">
                        <button class="reorder-button" data-order='${JSON.stringify(order.items).replace(/'/g, "&apos;")}'>REORDER</button>
                        <button class="view-details-button" data-order='${JSON.stringify(order).replace(/'/g, "&apos;")}'>VIEW DETAILS</button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listener to reorder buttons
        document.querySelectorAll('.reorder-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const orderItems = JSON.parse(event.target.getAttribute('data-order').replace(/&apos;/g, "'"));
                orderItems.forEach(item => {
                    addToCart(item.item, item.price, item.image, item.description, item.restaurantName, item.restaurantAddress, item.quantity);
                });
                alert('Items added to cart!');
            });
        });

        // Add event listener to view details buttons
        document.querySelectorAll('.view-details-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const order = JSON.parse(event.target.getAttribute('data-order').replace(/&apos;/g, "'"));
                showOrderDetails(order);
            });
        });
    }

    function addToCart(item, price, image, description, restaurantName, restaurantAddress, quantity = 1) {
        const userEmail = userData.email;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItemIndex = cart.findIndex(cartItem => cartItem.item === item && cartItem.userEmail === userEmail);
        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ item, price, image, description, restaurantName, restaurantAddress, quantity, userEmail });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function showOrderDetails(order) {
        const modal = document.getElementById('orderDetailsModal');
        const orderDetailsContainer = document.getElementById('orderDetailsContainer');

        const grandTotal = order.grandTotal !== undefined ? order.grandTotal.toFixed(2) : 'N/A';
        const subTotal = order.subTotal !== undefined ? order.subTotal.toFixed(2) : 'N/A';
        const taxes = order.taxes !== undefined ? order.taxes.toFixed(2) : 'N/A';
        const discount = order.discount !== undefined ? order.discount.toFixed(2) : 'N/A';
        const userAdd = order.userAddress;
        const uA = `<p>${userAdd.replace(/<br>\s*/g, ' ')}</p>`;
        orderDetailsContainer.innerHTML = `
            <div class="order-details-container">
                <div class="order-details-header">
                    <h2>Order #${order.id}</h2>
                    <span class="close" onclick="document.getElementById('orderDetailsModal').style.display='none'">&times;</span>
                </div>
                <div class="order-details-section">
                    <h3><i class="fas fa-utensils location-icon"></i> ${order.items[0].restaurantName}</h3>
                    <p>${order.items[0].restaurantAddress}</p>
                    <h3 style="margin-top:10px;"><i class="fas fa-building location-icon"></i> Delivery Spot </h3>
                    <p class="spot"> ${uA} </p>
                    <hr class="separator">
                    <p class="delivery"><i class="fas fa-check-square check-icon"></i> Delivered on ${order.date} at ${order.time}</p>
                    <hr class="separator">
                </div>
                <div class="order-details-section">
                    <h3><i class="fas fa-hamburger items-icon"></i>Items</h3>
                    ${order.items.map(item => `
                        <p>${item.item} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</p>
                    `).join('')}
                </div>
                <div class="order-details-section order-details-summary">
                    <p>Sub Total: <span>₹${subTotal}</span></p>
                    <p>Discount: <span>₹${discount}</span></p>
                    <p>Taxes and Charges: <span>₹${taxes}</span></p>
                    <p class="grand-total">Grand Total: <span>₹${grandTotal}</span></p>
                </div>
            </div>
        `;

        // Show the modal
        modal.style.display = "block";

        // Close the modal when the user clicks on <span> (x)
        modal.querySelector('.close').onclick = function () {
            modal.style.display = "none";
        }

        // Close the modal when the user clicks anywhere outside of the modal
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    document.getElementById('past-orders').addEventListener('click', () => {
        showSection(pastOrdersSection);
    });

    document.getElementById('edit-profile').addEventListener('click', () => {
        showSection(editProfileSection);
    });

    document.getElementById('logout').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('loggedInUser');
            alert('Logged out successfully.');
            window.location.href = 'login.html';
        }
    });

    function showSection(section) {
        pastOrdersSection.classList.add('hidden');
        editProfileSection.classList.add('hidden');
        section.classList.remove('hidden');
    }

    function displayProfileData(userData) {
        document.getElementById('display-first-name').textContent = userData.firstName || '';
        document.getElementById('display-last-name').textContent = userData.lastName || '';
        document.getElementById('display-phone').textContent = userData.phone || '';
        document.getElementById('display-email').textContent = userData.email || '';
        document.getElementById('display-password').textContent = '************';
        document.getElementById('display-state').textContent = userData.address.state || '';
        document.getElementById('display-city').textContent = userData.address.city || '';
        document.getElementById('display-locality').textContent = userData.address.locality || '';
        document.getElementById('display-address').textContent = userData.address.address || '';
        document.getElementById('display-pincode').textContent = userData.address.pincode || '';
    }

    document.querySelectorAll('.change-button').forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            const inputField = document.getElementById(target);
            const displayField = document.getElementById(`display-${target.replace('edit-', '')}`);
            displayField.classList.add('hidden');
            inputField.classList.remove('hidden');
            button.classList.add('hidden');

            if (target === 'edit-password') {
                const confirmPasswordGroup = document.getElementById('confirm-password-group');
                confirmPasswordGroup.classList.remove('hidden');
                document.getElementById('confirm-password-label').classList.remove('hidden');
                document.getElementById('confirm-password').classList.remove('hidden');
            }
        });
    });

    stateSelect.addEventListener('change', function () {
        const state = stateSelect.value;
        if (state) {
            citySelect.innerHTML = '<option value="">Select City</option>';
            stateCityMapping[state].forEach(city => {
                citySelect.innerHTML += `<option value="${city.toLowerCase()}">${city}</option>`;
            });
            citySelect.disabled = false;
            citySelect.classList.remove('disabled');
        } else {
            citySelect.innerHTML = '<option value="">Select City</option>';
            citySelect.disabled = true;
            citySelect.classList.add('disabled');
            localitySelect.innerHTML = '<option value="">Select Locality</option>';
            localitySelect.disabled = true;
            localitySelect.classList.add('disabled');
        }
    });

    citySelect.addEventListener('change', function () {
        const city = citySelect.value;
        if (city) {
            localitySelect.innerHTML = '<option value="">Select Locality</option>';
            cityLocalityMapping[city].forEach(locality => {
                localitySelect.innerHTML += `<option value="${locality.toLowerCase()}">${locality}</option>`;
            });
            localitySelect.disabled = false;
            localitySelect.classList.remove('disabled');
        } else {
            localitySelect.innerHTML = '<option value="">Select Locality</option>';
            localitySelect.disabled = true;
            localitySelect.classList.add('disabled');
        }
    });

    document.getElementById('edit-profile-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const updatedUser = {
            firstName: document.getElementById('edit-first-name').value.trim(),
            lastName: document.getElementById('edit-last-name').value.trim(),
            phone: document.getElementById('edit-phone').value.trim(),
            email: document.getElementById('edit-email').value.trim(),
            password: document.getElementById('edit-password').value.trim(),
            address: {
                state: document.getElementById('edit-state').value.trim(),
                city: document.getElementById('edit-city').value.trim(),
                locality: document.getElementById('edit-locality').value.trim(),
                address: document.getElementById('edit-address').value.trim(),
                pincode: document.getElementById('edit-pincode').value.trim(),
            }
        };

        let isValid = true;

        document.querySelectorAll('.input-field').forEach(inputField => {
            if (!inputField.classList.contains('hidden')) {
                const fieldName = inputField.id.replace('edit-', '');
                const errorField = document.getElementById(`${inputField.id}-error`);
                switch (fieldName) {
                    case 'first-name':
                        if (!updatedUser.firstName) {
                            showError(errorField, 'Please enter first name');
                            isValid = false;
                        } else {
                            hideError(errorField);
                        }
                        break;
                    case 'last-name':
                        if (!updatedUser.lastName) {
                            showError(errorField, 'Please enter last name');
                            isValid = false;
                        } else {
                            hideError(errorField);
                        }
                        break;
                    case 'phone':
                        if (!updatedUser.phone || !/^\d{10}$/.test(updatedUser.phone)) {
                            showError(errorField, 'Please enter a valid 10-digit phone number');
                            isValid = false;
                        } else {
                            hideError(errorField);
                        }
                        break;
                    case 'email':
                        if (!updatedUser.email || !validateEmail(updatedUser.email)) {
                            showError(errorField, 'Please enter a valid email address');
                            isValid = false;
                        } else {
                            hideError(errorField);
                        }
                        break;
                    case 'password':
                        if (!updatedUser.password || updatedUser.password.length < 8) {
                            showError(errorField, 'Password must be at least 8 characters long');
                            isValid = false;
                        } else {
                            hideError(errorField);
                        }
                        const confirmPassword = document.getElementById('confirm-password').value.trim();
                        const confirmPasswordError = document.getElementById('confirm-password-error');
                        if (updatedUser.password !== confirmPassword) {
                            showError(confirmPasswordError, 'Passwords do not match');
                            isValid = false;
                        } else {
                            hideError(confirmPasswordError);
                        }
                        break;
                    case 'state':
                        if (!updatedUser.address.state) {
                            showError(errorField, 'Please select state');
                            isValid = false;
                        } else {
                            hideError(errorField);
                        }
                        break;
                    case 'city':
                        if (!updatedUser.address.city) {
                            showError(errorField, 'Please select city');
                            isValid = false;
                        } else {
                            hideError(errorField);
                        }
                        break;
                    case 'locality':
                        if (!updatedUser.address.locality) {
                            showError(errorField, 'Please select locality');
                            isValid = false;
                        } else {
                            hideError(errorField);
                        }
                        break;
                    case 'address':
                        if (!updatedUser.address.address) {
                            showError(errorField, 'Please enter your address');
                            isValid = false;
                        } else {
                            hideError(errorField);
                        }
                        break;
                    case 'pincode':
                        if (!/^\d{6}$/.test(updatedUser.address.pincode)) {
                            showError(errorField, 'Please enter a valid 6-digit pincode');
                            isValid = false;
                        } else {
                            hideError(errorField);
                        }
                        break;
                }
            }
        });

        if (isValid) {
            localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
            updateUserInDatabase(userData, updatedUser);
            alert('Profile updated successfully.');
            displayProfileData(updatedUser);
            hideAllInputFields();
            showAllChangeButtons();
            document.getElementById('confirm-password-group').classList.add('hidden'); // Hide confirm password field
            document.getElementById('confirm-password').value = ''; // Clear confirm password field
        }
    });

    function showError(errorField, message) {
        errorField.textContent = message;
        errorField.style.display = 'block';
    }

    function hideError(errorField) {
        errorField.style.display = 'none';
    }

    function hideAllInputFields() {
        document.querySelectorAll('.input-field').forEach(field => field.classList.add('hidden'));
        document.getElementById('confirm-password-group').classList.add('hidden'); // Hide confirm password field
    }

    function showAllChangeButtons() {
        document.querySelectorAll('.change-button').forEach(button => button.classList.remove('hidden'));
    }

    function updateUserInDatabase(oldData, newData) {
        const usersDatabase = JSON.parse(localStorage.getItem('usersDatabase')) || [];
        const userIndex = usersDatabase.findIndex(user => user.email === oldData.email || user.phone === oldData.phone);
        if (userIndex !== -1) {
            usersDatabase[userIndex] = newData;
            localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase));
        }
    }

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z]+\.[a-zA-Z]+$/;
        const localPart = email.split('@')[0];
        const validLength = localPart.length >= 6 && localPart.length <= 30;
        const startsWithDot = /^\./.test(localPart);
        const invalidCharacters = /[^a-zA-Z0-9.]/.test(localPart);
        return emailPattern.test(email) && validLength && !startsWithDot && !invalidCharacters;
    }

    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Remove active class from all links
            sidebarLinks.forEach(link => link.classList.remove('active'));
            // Add active class to the clicked link
            event.currentTarget.classList.add('active');
        });
    });
});

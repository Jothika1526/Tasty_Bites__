document.addEventListener("DOMContentLoaded", function() {
    const mobileMenu = document.getElementById("mobile-menu");
    const sidebar = document.getElementById("mySidebar");
    const closeBtn = document.getElementById("closeBtn");

    mobileMenu.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    const links = document.querySelectorAll('nav .nav-links li a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(link => link.classList.remove('active'));
            link.classList.add('active');
        });
    });

    const currentPage = window.location.pathname.split('/').pop();
    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    const filterButtons = document.querySelectorAll(".filter-button");
    const restaurantCards = Array.from(document.querySelectorAll(".restaurant"));
    const originalOrder = [...restaurantCards]; // Store the original order of restaurant cards
    const topRestaurantsContainer = document.querySelector(".top-restaurants-container");

    const locationSelect = document.getElementById('location');
    const areaSelect = document.getElementById('area');

    const areaMapping = {
        coimbatore: ["RS Puram", "Kalapatti"],
        chennai: ["Tnagar", "Adayar"],
    };

    locationSelect.addEventListener('change', function() {
        const selectedLocation = locationSelect.value;
        const areas = areaMapping[selectedLocation] || [];
        areaSelect.innerHTML = areas.map(area => `<option value="${area.toLowerCase()}">${area}</option>`).join('');
    });

    areaSelect.addEventListener('change', function() {
        const selectedLocation = locationSelect.value;
        const selectedArea = areaSelect.value;
        console.log("Selected Location:", selectedLocation);
        console.log("Selected Area:", selectedArea);

        // Construct the URL based on the selected location and area
        const url = `${selectedLocation}_${selectedArea}.html`;

        // Reload the page with the new URL
        window.location.href = url;
    });

    // Event listener for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove the active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove("active"));
            // Add the active class to the clicked button
            button.classList.add("active");

            const filterType = button.id;
            filterRestaurants(filterType);
        });
    });

    // Filter functions
    function filterByDeliveryTime(card, maxTime) {
        const deliveryTime = parseInt(card.dataset.deliveryTime);
        card.style.display = deliveryTime <= maxTime ? "block" : "none";
    }

    function filterByRating(card, minRating) {
        const rating = parseFloat(card.dataset.rating);
        card.style.display = rating >= minRating ? "block" : "none";
    }

    function filterByVeg(card) {
        const isVeg = card.dataset.veg === "true";
        card.style.display = isVeg ? "block" : "none";
    }

    function filterByNonVeg(card) {
        const isVeg = card.dataset.veg === "false";
        card.style.display = isVeg ? "block" : "none";
    }

    function filterByOffer(card) {
        const hasOffer = card.dataset.offer === "true";
        card.style.display = hasOffer ? "block" : "none";
    }

    function filterByCost(card, minCost, maxCost) {
        const cost = parseInt(card.dataset.cost);
        card.style.display = cost >= minCost && cost <= maxCost ? "block" : "none";
    }

    function filterByCuisine(card, cuisine) {
        const cardCuisine = card.getAttribute('cuisine');
        card.style.display = cardCuisine === cuisine ? "block" : "none";
    }

    // Function to filter restaurants based on filter type
    function filterRestaurants(filterType) {
        restaurantCards.forEach(card => {
            switch (filterType) {
                case "fast-delivery":
                    filterByDeliveryTime(card, 30);
                    break;
                case "ratings":
                    filterByRating(card, 4.0);
                    break;
                case "pure-veg":
                    filterByVeg(card);
                    break;
                case "non-veg":
                    filterByNonVeg(card);
                    break;
                case "offers":
                    filterByOffer(card);
                    break;
                case "cost-less-300":
                    filterByCost(card, 0, 300);
                    break;
                case "cuisine-kids":
                    filterByCuisine(card, 'kids');
                    break;
                case "cuisine-south-indian":
                    filterByCuisine(card, 'south indian');
                    break;
                case "cuisine-chinese":
                    filterByCuisine(card, 'chinese');
                    break;
                case "default":
                    card.style.display = "block";
                    break;
                default:
                    card.style.display = "block";
            }
        });
        updateRestaurantsContainer();
    }

    // Function to update the restaurants container after filtering
    function updateRestaurantsContainer() {
        const restaurantsContainer = document.querySelector(".restaurants-container");
        restaurantsContainer.innerHTML = "";
        restaurantCards.forEach(card => {
            if (card.style.display === "block") {
                restaurantsContainer.appendChild(card);
            }
        });
    }

    // Sort dropdown functionality
    function toggleSortDropdown() {
        document.getElementById("sortDropdown").classList.toggle("show");
    }

    window.onclick = function(event) {
        if (!event.target.matches('.filter-button')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    // Sorting function
    function sortRestaurants(sortType) {
        const restaurantsContainer = document.querySelector(".restaurants-container");

        let sortedCards;
        switch (sortType) {
            case "delivery-time":
                sortedCards = restaurantCards.sort((a, b) => parseInt(a.dataset.deliveryTime) - parseInt(b.dataset.deliveryTime));
                break;
            case "rating":
                sortedCards = restaurantCards.sort((a, b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
                break;
            case "cost-low-high":
                sortedCards = restaurantCards.sort((a, b) => parseInt(a.dataset.cost) - parseInt(b.dataset.cost));
                break;
            case "cost-high-low":
                sortedCards = restaurantCards.sort((a, b) => parseInt(b.dataset.cost) - parseInt(a.dataset.cost));
                break;
            default:
                sortedCards = originalOrder;
        }

        restaurantsContainer.innerHTML = "";
        sortedCards.forEach(card => restaurantsContainer.appendChild(card));
    }

    // Event listener for sort radio buttons
    document.querySelectorAll('input[name="sort"]').forEach(input => {
        input.addEventListener('change', function() {
            sortRestaurants(this.value);
        });
    });

    // Function to display top restaurants
    function displayTopRestaurants() {
        topRestaurantsContainer.innerHTML = ""; // Clear any existing top restaurants
        const topRestaurants = Array.from(restaurantCards).filter(card => parseFloat(card.dataset.rating) > 4.5);
        topRestaurants.forEach(card => {
            const link = document.createElement("a");
            link.href = "restaurant-details.html"; // Change to your actual link if needed
            link.classList.add("restaurant-link");
            link.appendChild(card.cloneNode(true)); // Clone the card to avoid removing it from the original list
            topRestaurantsContainer.appendChild(link);
        });
    }

    // Call the function to display top restaurants initially
    displayTopRestaurants();
});

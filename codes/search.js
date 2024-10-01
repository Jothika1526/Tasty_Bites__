document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('nav .nav-links li a');
  

    const locationSelect = document.getElementById('location');
    const areaSelect = document.getElementById('area');
    

    const areaMapping = {
        coimbatore: ["RS Puram", "Kalapatti"],
        chennai: ["Tnagar", "Adayar"]
    };


  

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const searchResults = document.getElementById("search-results");
    const popularDishesSection = document.querySelector("section.dishes");

        const data = [
            { type: "dish", name: "Wednesday Offer", link: "../kfc/wednesday_offer.html", image: "../kfc/kfc_images/wed offer.jpeg" },
            { type: "dish", name: "Bucket Offer", link: "../kfc/bucket_offer.html", image: "../kfc/kfc_images/bucket_offer.jpg" },
            { type: "dish", name: "Super Saver Offer", link: "../kfc/super_saver_offer.html", image: "../kfc/kfc_images/super_saver_item.jpg" },
    
    
            { type: "dish", name: "Unlimited bbq offer", link: "../bbq nation_cbe/unlimited_bbq.html", image: "../bbq nation_cbe/bbq_images/unlimited_bbq.jpg" },
            { type: "dish", name: "Family feast deal", link: "../bbq nation_cbe/family_feast.html", image: "../bbq nation_cbe/bbq_images/family_feast.jpg" },
            { type: "dish", name: "Weekday Special Offer", link: "../bbq nation_cbe/weekday_offer.html", image: "../bbq nation_cbe/bbq_images/weekday_offer.jpg" },
    
    
        { type: "dish", name: "Breakfast combo", link: "../annapoorna_cbe/breakfast.html", image: "../annapoorna_cbe/anna_images/breakfast.jpg" },
            { type: "dish", name: "Lunch combo", link: "../annapoorna_cbe/lunch.html", image: "../annapoorna_cbe/anna_images/lunch.jpg" },
            { type: "dish", name: "dinner combo", link: "../annapoorna_cbe/dinner.html", image: "../annapoorna_cbe/anna_images/dinner.jpg" },
    
            { type: "dish", name: "Vegeterian combo", link: "../dahlia/veg.html", image: "../dahlia_che/dah_images/veg.jpg" },
    
            { type: "dish", name: "feast", link: "../Pavilion_cbe/feast.html", image: "../Pavilion_cbe/pav_images/feast.jpg" },
            { type: "dish", name: "delight", link: "../Pavilion_cbe/super_saver_offer.html", image: "../Pavilion_cbe/pav_images/delight.jpg" },
    
    
        { type: "dish", name: "North indian", link: "../raintree_che/north.html", image: "../raintree_che/rain_images/north.jpg" },
            { type: "dish", name: "South Indian", link: "../raintree_che/south.html", image: "../raintree_che/rain_images/south.jpg" },
            { type: "dish", name: "Vegan Platter", link: "../raintree_che/vegan.html", image: "../raintree_che/rain_images/veg.jpg" },
    
    
        { type: "dish", name: "Coastal Cuisine", link: "./south_spice_che/coastal.html", image: "../south_spice_che/ss_images/coastal.jpg" },
            { type: "dish", name: "Sadya", link: "./south_spice_che/sadya.html", image: "../south_spice_che/ss_images/sadya.jpg" },
            { type: "dish", name: "Royal Thali", link: "./south_spice_che/thali.html", image: "../south_spice_che/ss_images/thali.jpg" },
    
        ];


    function renderResults(results) {
        searchResults.innerHTML = "";
        if (results.length === 0) {
            searchResults.innerHTML = "<p class='no-results'>No results found.</p>";
        } else {
            results.forEach(item => {
                const itemHTML = document.createElement("div");
                itemHTML.classList.add("result-item");
                itemHTML.innerHTML = `
                    <a href="${item.link}">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <h3>${item.name}</h3>
                            <p>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
                        </div>
                    </a>
                `;
                searchResults.appendChild(itemHTML);
            });
        }
    }

    function search(query) {
        if (query.trim() === "") {
            popularDishesSection.style.display = "block"; // Show popular dishes if search is empty
            searchResults.innerHTML = ""; // Clear any previous results
            return;
        }
        popularDishesSection.style.display = "none"; // Hide popular dishes when displaying results
        const filteredResults = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        renderResults(filteredResults);
    }

    searchInput.addEventListener("input", () => search(searchInput.value));
    searchButton.addEventListener("click", () => search(searchInput.value));
    
});

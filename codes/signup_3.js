const stateCityMapping = {
    tamilnadu: ["Chennai", "Coimbatore"]
};

const cityLocalityMapping = {
    coimbatore: ["RS Puram", "Kalapatti"],
    chennai: ["Tnagar", "Adayar"]

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
            localitySelect.innerHTML += `<option value="${locality}">${locality}</option>`;
        });
        localitySelect.disabled = false;
        localitySelect.classList.remove('disabled');
    } else {
        localitySelect.innerHTML = '<option value="" disabled selected>Select Locality</option>';
        localitySelect.disabled = true;
        localitySelect.classList.add('disabled');
    }
});

document.getElementById('next-button').addEventListener('click', function() {
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
        // Retrieve user data from localStorage
        let userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.address = {
            state,
            city,
            locality,
            address,
            pincode
        };

        // Save updated user data to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));

        // Save user data to database (localStorage for demo)
        const usersDatabase = JSON.parse(localStorage.getItem('usersDatabase')) || [];
        usersDatabase.push(userData);
        localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase));

        alert('User registered successfully!');

        // Redirect to a different page or reset the form
        window.location.href = "login.html";
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const locationSelect = document.getElementById('location');
    const areaSelect = document.getElementById('area');
    const homeLink = document.getElementById('home-link');

    const areaMapping = {
        coimbatore: ["RS Puram", "Kalapatti"],
        chennai: ["Tnagar", "Adayar"]
    };

    function updateHomeLink() {
        const selectedLocation = locationSelect.value;
        const selectedArea = areaSelect.value;
        const url = `${selectedLocation}_${selectedArea}.html`;
        homeLink.setAttribute('href', url);
    }

    locationSelect.addEventListener('change', function() {
        const selectedLocation = locationSelect.value;
        const areas = areaMapping[selectedLocation] || [];
        areaSelect.innerHTML = areas.map(area => `<option value="${area.toLowerCase()}">${area}</option>`).join('');
        updateHomeLink();
        localStorage.setItem('selectedLocation', selectedLocation);
        localStorage.setItem('selectedArea', areaSelect.value);
    });

    areaSelect.addEventListener('change', function() {
        updateHomeLink();
        localStorage.setItem('selectedArea', areaSelect.value);
    });

    // Load the selected location and area from local storage
    const savedLocation = localStorage.getItem('selectedLocation') || 'coimbatore';
    const savedArea = localStorage.getItem('selectedArea') || 'RS Puram';
    locationSelect.value = savedLocation;
    const areas = areaMapping[savedLocation] || [];
    areaSelect.innerHTML = areas.map(area => `<option value="${area.toLowerCase()}">${area}</option>`).join('');
    areaSelect.value = savedArea.toLowerCase();
    updateHomeLink();
});

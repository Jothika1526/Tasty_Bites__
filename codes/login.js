document.getElementById('login-button').addEventListener('click', function() {
    const loginId = document.getElementById('login-id').value.trim();
    const password = document.getElementById('password').value.trim();

    let isValid = true;

    // Clear previous error messages
    document.getElementById('login-id-error').style.display = 'none';
    document.getElementById('password-error').style.display = 'none';

    if (!loginId) {
        document.getElementById('login-id-error').textContent = 'Please enter your email or phone number';
        document.getElementById('login-id-error').style.display = 'block';
        isValid = false;
    }

    if (!password) {
        document.getElementById('password-error').textContent = 'Please enter your password';
        document.getElementById('password-error').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Retrieve user data from the database (localStorage)
        const usersDatabase = JSON.parse(localStorage.getItem('usersDatabase')) || [];
        const user = usersDatabase.find(user => user.email === loginId || user.phone === loginId);

        if (!user) {
            document.getElementById('login-id-error').textContent = 'User not registered';
            document.getElementById('login-id-error').style.display = 'block';
        } else if (user.password !== password) {
            document.getElementById('password-error').textContent = 'Incorrect Password';
            document.getElementById('password-error').style.display = 'block';
        } else {
            alert('Login successful!');
            // Store logged-in user information
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            // Redirect to the correct page based on the user's city and locality
            const cityLocality = `${user.city}.to_${user.locality}.html`;
            window.location.href = "coimbatore_RS Puram.html";
        }
    }
});

function togglePasswordVisibility(fieldId, button) {
    const field = document.getElementById(fieldId);
    const icon = button.querySelector('i');
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

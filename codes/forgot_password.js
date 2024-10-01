document.getElementById('next-button').addEventListener('click', function() {
    const loginId = document.getElementById('forgot-login-id').value.trim();

    let isValid = true;

    if (!loginId) {
        document.getElementById('forgot-login-id-error').textContent = 'Please enter your email or phone number';
        document.getElementById('forgot-login-id-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('forgot-login-id-error').style.display = 'none';
    }

    if (isValid) {
        // Retrieve user data from the database (localStorage)
        const usersDatabase = JSON.parse(localStorage.getItem('usersDatabase')) || [];
        const user = usersDatabase.find(user => user.email === loginId || user.phone === loginId);

        if (!user) {
            document.getElementById('forgot-login-id-error').textContent = 'User not registered';
            document.getElementById('forgot-login-id-error').style.display = 'block';
        } else {
            // Save the loginId to session storage for use in the next step
            sessionStorage.setItem('forgotLoginId', loginId);

            // Redirect to the security question page
            window.location.href = "security_question.html";
        }
    }
});

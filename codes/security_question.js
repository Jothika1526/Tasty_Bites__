document.addEventListener('DOMContentLoaded', function() {
    const loginId = sessionStorage.getItem('forgotLoginId');
    if (!loginId) {
        window.location.href = "forgot_password.html";
    }

    // Retrieve user data from the database (localStorage)
    const usersDatabase = JSON.parse(localStorage.getItem('usersDatabase')) || [];
    const user = usersDatabase.find(user => user.email === loginId || user.phone === loginId);

    if (!user) {
        window.location.href = "forgot_password.html";
    }

    // Define security question placeholders
    const securityQuestions = {
        "pet-name": "What is your pet's name?",
        "birth-city": "In which city were you born?",
        "first-school": "What was the name of your first school?",
        "favorite-book": "What is your favorite book?",
        "best-friend": "What is your best friend's name?"
    };

    // Set the placeholder based on the saved security question ID
    if (user && user.securityQuestion) {
        document.getElementById('security-answer').placeholder = securityQuestions[user.securityQuestion] || 'Security question not found';
    } else {
        document.getElementById('security-answer').placeholder = 'Security question not found';
    }

    document.getElementById('verify-button').addEventListener('click', function() {
        const securityAnswer = document.getElementById('security-answer').value.trim();

        if (securityAnswer !== user.securityAnswer) {
            document.getElementById('security-answer-error').textContent = 'Incorrect answer';
            document.getElementById('security-answer-error').style.display = 'block';
        } else {
            // Save the loginId to session storage for use in the next step
            sessionStorage.setItem('forgotLoginId', loginId);

            // Redirect to the reset password page
            window.location.href = "reset_password.html";
        }
    });
});

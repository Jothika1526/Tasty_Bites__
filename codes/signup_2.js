document.getElementById('next-button').addEventListener('click', function() {
    const password = document.getElementById('password').value.trim();
    const rePassword = document.getElementById('re-password').value.trim();
    const securityQuestion = document.getElementById('security-question').value;
    const securityAnswer = document.getElementById('security-answer').value.trim();

    let isValid = true;

    if (password.length < 8) {
        document.getElementById('password-error').textContent = 'Password too weak. It should be minimum 8 characters';
        document.getElementById('password-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('password-error').style.display = 'none';
    }

    if (rePassword !== password) {
        document.getElementById('re-password-error').textContent = 'Passwords do not match';
        document.getElementById('re-password-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('re-password-error').style.display = 'none';
    }

    if (!securityQuestion) {
        document.getElementById('security-question-error').textContent = 'Please select a security question';
        document.getElementById('security-question-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('security-question-error').style.display = 'none';
    }

    if (!securityAnswer) {
        document.getElementById('security-answer-error').textContent = 'Please provide an answer to the security question';
        document.getElementById('security-answer-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('security-answer-error').style.display = 'none';
    }

    if (isValid) {
        // Retrieve user data from localStorage
        let userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.password = password;
        userData.securityQuestion = securityQuestion;
        userData.securityAnswer = securityAnswer;

        // Save updated user data to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));

        // Redirect to next page
        window.location.href = "signup_3.html";
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

document.getElementById('reset-button').addEventListener('click', function() {
    const newPassword = document.getElementById('new-password').value.trim();
    const reNewPassword = document.getElementById('re-new-password').value.trim();

    let isValid = true;

    if (newPassword.length < 8) {
        document.getElementById('new-password-error').textContent = 'Password too weak. It should be minimum 8 characters';
        document.getElementById('new-password-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('new-password-error').style.display = 'none';
    }

    if (reNewPassword !== newPassword) {
        document.getElementById('re-new-password-error').textContent = 'Passwords do not match';
        document.getElementById('re-new-password-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('re-new-password-error').style.display = 'none';
    }

    if (isValid) {
        // Retrieve user data from the database (localStorage)
        const loginId = sessionStorage.getItem('forgotLoginId');
        const usersDatabase = JSON.parse(localStorage.getItem('usersDatabase')) || [];
        const userIndex = usersDatabase.findIndex(user => user.email === loginId || user.phone === loginId);

        if (userIndex !== -1) {
            usersDatabase[userIndex].password = newPassword;
            localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase));
            alert('Password reset successful!');
            window.location.href = "login.html";
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

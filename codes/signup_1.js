// Dummy database to store user data
const usersDatabase = JSON.parse(localStorage.getItem('usersDatabase')) || [];

document.getElementById('next-button').addEventListener('click', function() {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const emailId = document.getElementById('email-id').value.trim();
    const termsCheckbox = document.getElementById('terms-checkbox').checked;

    let isValid = true;

    // Check if user already exists
    const userExists = usersDatabase.some(user => user.email === emailId || user.phone === phoneNumber);

    if (userExists) {
        alert('User already registered with this email or phone number');
        return;
    }

    if (!firstName) {
        document.getElementById('first-name-error').textContent = 'Please enter first name';
        document.getElementById('first-name-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('first-name-error').style.display = 'none';
    }

    if (!lastName) {
        document.getElementById('last-name-error').textContent = 'Please enter last name';
        document.getElementById('last-name-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('last-name-error').style.display = 'none';
    }

    if (!phoneNumber) {
        document.getElementById('phone-number-error').textContent = 'Please enter the phone number';
        document.getElementById('phone-number-error').style.display = 'block';
        isValid = false;
    } else if (!/^\d{10}$/.test(phoneNumber)) {
        document.getElementById('phone-number-error').textContent = 'Please enter a correct phone number';
        document.getElementById('phone-number-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('phone-number-error').style.display = 'none';
    }

    if (!emailId) {
        document.getElementById('email-id-error').textContent = 'Please enter the email ID';
        document.getElementById('email-id-error').style.display = 'block';
        isValid = false;
    } else {
        const emailPattern = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z]+\.[a-zA-Z]+$/;
        const localPart = emailId.split('@')[0];
        const validLength = localPart.length >= 6 && localPart.length <= 30;
        const startsWithDot = /^\./.test(localPart);
        const invalidCharacters = /[^a-zA-Z0-9.]/.test(localPart);

        if (!emailPattern.test(emailId) || !validLength || startsWithDot || invalidCharacters) {
            document.getElementById('email-id-error').textContent = 'Please enter a valid email ID';
            document.getElementById('email-id-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('email-id-error').style.display = 'none';
        }
    }

    if (!termsCheckbox) {
        document.getElementById('terms-error').textContent = 'You must agree to the terms and privacy policy';
        document.getElementById('terms-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('terms-error').style.display = 'none';
    }

    if (isValid) {
        // Save user data temporarily
        const userData = {
            firstName,
            lastName,
            phone: phoneNumber,
            email: emailId,
            termsAccepted: termsCheckbox
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Redirect to next page
        window.location.href = "signup_2.html";
    }
});

document.getElementById('email-id').addEventListener('input', function() {
    const emailField = document.getElementById('email-id');
    const emailValue = emailField.value;
    const lowercaseEmailValue = emailValue.toLowerCase();
    if (emailValue !== lowercaseEmailValue) {
        emailField.value = lowercaseEmailValue;
        document.getElementById('email-id-error').textContent = 'No capital letters allowed';
        document.getElementById('email-id-error').style.display = 'block';
    } else {
        document.getElementById('email-id-error').style.display = 'none';
    }
});

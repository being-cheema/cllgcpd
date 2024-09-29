// Initialize PocketBase with your API URL
const pb = new PocketBase('https://collegecupid.pockethost.io');

// To calculate Age

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust if the birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

// Loader function
function showLoader() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// DOM elements
const collegeSelect = document.getElementById('college');
const collegeEmailInput = document.getElementById('college_email');
const emailHint = document.getElementById('emailHint');
const emailError = document.getElementById('emailError');

// Update email hint based on selected college
collegeSelect.addEventListener('change', function () {
    const selectedDomain = this.value;
    emailHint.textContent = `Example: user${selectedDomain}`;
    emailError.textContent = '';
});

// Validate email domain
collegeEmailInput.addEventListener('input', function () {
    const selectedDomain = collegeSelect.value;
    const emailValue = this.value;

    if (selectedDomain && !emailValue.endsWith(selectedDomain)) {
        emailError.textContent = `Email domain must match ${selectedDomain}`;
    } else {
        emailError.textContent = '';
    }
});

// Move between form steps
function nextStep(stepNumber) {
    if (stepNumber === 2) {
        // Validate step 1 before proceeding
        const firstName = document.getElementById('first_name').value;
        const lastName = document.getElementById('last_name').value;
        const gender = document.getElementById('gender').value;

        if (!firstName || !lastName || !gender) {
            alert('Please fill out all fields in Step 1.');
            return;
        }
    } else if (stepNumber === 3) {
        // Validate step 2 before proceeding
        const dob = document.getElementById('dob').value;
        const college = document.getElementById('college').value;
        const collegeEmail = document.getElementById('college_email').value;
        const emailErrorText = emailError.textContent;

        if (!dob || !college || !collegeEmail || emailErrorText) {
            alert('Please fill out all fields in Step 2 correctly.');
            return;
        }
    }

    document.querySelector('.question.active').classList.remove('active');
    document.getElementById(`formStep${stepNumber}`).classList.add('active');
}

// Handle form submission
async function submitForm() {
    showLoader(); // Show loader

    const dobInput = document.getElementById('dob');
    const dob = dobInput.value;
    const age = calculateAge(dob);  // Calculate the user's age

    const idCardInput = document.getElementById('id_card');
    const idCardFile = idCardInput.files[0];
    const p1Input = document.getElementById('p1');
    const p1File = p1Input.files[0];
    const p2Input = document.getElementById('p2');
    const p2File = p2Input.files[0];
    const p3Input = document.getElementById('p3');
    const p3File = p3Input.files[0];
    const p4Input = document.getElementById('p4');
    const p4File = p4Input.files[0];
    const p5Input = document.getElementById('p5');
    const p5File = p5Input.files[0];
    const email = document.getElementById('college_email').value;

    if (!idCardFile) {
        alert('Please upload your ID card.');
        hideLoader(); // Hide loader
        return;
    }

    if (emailError.textContent !== '') {
        alert('Please fix the errors before submitting.');
        hideLoader(); // Hide loader
        return;
    }

    try {
        // Check if email already exists
        const existingUsers = await pb.collection('users').getList(1, 1, { filter: `email="${email}"` });
        if (existingUsers.items.length > 0) {
            alert('An account with this email already exists. Please use a different email.');
            hideLoader(); // Hide loader
            return;
        }
    } catch (error) {
        console.error('Error checking existing email:', error);
        alert('Something went wrong. Please try again.');
        hideLoader(); // Hide loader
        return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('email', email);
    formData.append('emailVisibility', true);
    formData.append('password', document.getElementById('password').value);
    formData.append('passwordConfirm', document.getElementById('passwordConfirm').value);
    formData.append('first_name', document.getElementById('first_name').value);
    formData.append('last_name', document.getElementById('last_name').value);
    formData.append('Gender', document.getElementById('gender').value);
    formData.append('dob', `${document.getElementById('dob').value} 12:00:00`);
    formData.append('age', age);  // Add age to the form data
    formData.append('College', document.getElementById('college').options[document.getElementById('college').selectedIndex].text);
    formData.append('id_card', idCardFile);
    formData.append('p1', p1File);
    formData.append('p2', p2File);
    formData.append('p3', p3File);
    formData.append('p4', p4File);
    formData.append('p5', p5File);

    try {
        // Create user record with form data including the ID card and profile pictures
        await pb.collection('users').create(formData);
        window.location.href = 'verify.html'; // Redirect to the next page
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Something went wrong. Please try again.');
    } finally {
        hideLoader(); // Hide loader regardless of success or error
    }
}

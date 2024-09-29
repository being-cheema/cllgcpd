const pb = new PocketBase('https://collegecupid.pockethost.io');

async function loginUser(email, password) {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        return authData;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Login failed. Please check your credentials.');
    }
}

async function submitLogin() {
    const email = document.getElementById('college_email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember_me').checked;

    try {
        const authData = await loginUser(email, password);

        // Check if the user is verified
        if (!authData.record.verified) {
            window.location.href = 'verify.html'; // Redirect to verify page if not verified
        } else {
            // Store session data if 'Remember me' is checked
            if (rememberMe) {
                localStorage.setItem('authToken', authData.token);
                localStorage.setItem('userId', authData.record.id);
            }

            window.location.href = 'dashboard.html'; // Redirect to dashboard if verified
        }
    } catch (error) {
        document.getElementById('loginError').textContent = error.message;
    }
}

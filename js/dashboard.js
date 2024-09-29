const pb = new PocketBase('https://collegecupid.pockethost.io');

window.addEventListener('load', async () => {
    // Check if user is logged in (either sessionStorage or localStorage)
    const userData = sessionStorage.getItem('user') || localStorage.getItem('user');

    if (!userData) {
        window.location.href = 'index.html'; // Redirect if not logged in
        return;
    }

    // Parse the stored user data
    const currentUser = JSON.parse(userData);

    try {
        // Verify the current user's session with PocketBase to ensure they are still logged in
        if (!pb.authStore.isValid) {
            // If the session is invalid, log out the user and redirect
            pb.authStore.clear();
            sessionStorage.removeItem('user');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
            return;
        }

        // Display logged-in user's information
        const userInfoDiv = document.getElementById('user-info');
        userInfoDiv.innerHTML = `
            <div>
                <p><strong>${currentUser.record.first_name} ${currentUser.record.last_name}</strong></p>
                <p>${currentUser.record.College}</p>
                <button onclick="redirectToForYou()">Home</button>
            </div>
        `;

        // Fetch and display other users' photos
        const photoGallery = document.getElementById('photo-gallery');
        const users = await pb.collection('users').getFullList();

        users.forEach(user => {
            if (user.id !== currentUser.record.id) {
                const userCard = document.createElement('div');
                userCard.classList.add('user-card');
                userCard.innerHTML = `
                    <img src="https://collegecupid.pockethost.io/api/files/${user.collectionId}/${user.id}/${user.id_card}" alt="${user.first_name}'s photo">
                    <div class="user-info">
                        <p><strong>${user.first_name} ${user.last_name}</strong></p>
                        <p>${user.College}</p>
                    </div>
                `;
                photoGallery.appendChild(userCard);
            }
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        window.location.href = 'index.html';
    }
});

// Redirect to "For You" page
function redirectToForYou() {
    window.location.href = 'foryou.html';
}

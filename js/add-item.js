import { addItem, getUserProfile } from './db.js';
import { auth } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-item-form');
    if (!form) return;

    // Check auth
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'login.html';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            // Fetch user profile
            const userProfile = await getUserProfile(auth.currentUser.uid);
            
            const itemData = {
                type: document.getElementById('type').value,
                title: document.getElementById('title').value,
                location: document.getElementById('location').value,
                description: document.getElementById('description').value,
                contact: document.getElementById('contact').value,
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                userName: userProfile ? userProfile.name : 'Unknown',
                userMajor: userProfile ? userProfile.major : 'Unknown',
                userNim: userProfile ? userProfile.nim : 'Unknown'
            };

            // Add reward if it exists (lost items)
            const rewardInput = document.getElementById('reward');
            if (rewardInput) {
                itemData.reward = rewardInput.value;
            }

            await addItem(itemData);
            window.location.href = itemData.type === 'lost' ? 'lost.html' : 'found.html';
        } catch (error) {
            console.error(error);
            alert('Error submitting report: ' + error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
        }
    });
});

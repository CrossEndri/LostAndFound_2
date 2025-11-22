import { monitorAuthState, logOut } from './auth.js';
import { getItems, getItemById, updateItemStatus } from './db.js';
import { createItemCard, formatDate } from './utils.js';
import { auth } from './firebase-config.js';

// Global function for modal
window.openItemModal = async (id) => {
    const modal = document.getElementById('item-modal');
    const modalContent = document.getElementById('modal-body');
    
    modalContent.innerHTML = '<p class="text-center">Loading...</p>';
    modal.classList.add('active');

    try {
        // Wait for auth to initialize to ensure we have the correct user
        const currentUser = await new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe();
                resolve(user);
            });
        });

        const item = await getItemById(id);
        if (item) {
            const isResolved = item.status === 'resolved';
            const badgeClass = isResolved ? 'badge-resolved' : (item.type === 'lost' ? 'badge-lost' : 'badge-found');
            const badgeText = isResolved ? 'Resolved' : (item.type === 'lost' ? 'Lost' : 'Found');
            
            // Check if current user is owner
            const isOwner = currentUser && currentUser.uid === item.userId;
            
            modalContent.innerHTML = `
                <div class="mb-4">
                    <span class="badge ${badgeClass}">${badgeText}</span>
                    <span style="float: right; color: var(--text-muted);">
                        ${formatDate(item.createdAt)}
                    </span>
                </div>
                <h2>${item.title}</h2>
                <p class="mt-4" style="white-space: pre-wrap;">${item.description}</p>
                
                <div class="mt-4" style="background: var(--background-color); padding: 1rem; border-radius: 0.5rem;">
                    <p><strong>📍 Location:</strong> ${item.location}</p>
                    <p class="mt-2"><strong>📞 Contact:</strong> ${item.contact}</p>
                    ${item.reward ? `<p class="mt-2"><strong>💰 Reward:</strong> ${item.reward}</p>` : ''}
                    
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">Reported by:</p>
                        <p><strong>👤 Name:</strong> ${item.userName || 'Unknown'}</p>
                        <p class="mt-1"><strong>🎓 Major:</strong> ${item.userMajor || 'Unknown'}</p>
                        <p class="mt-1"><strong>🆔 NIM:</strong> ${item.userNim || 'Unknown'}</p>
                    </div>
                </div>

                ${isOwner && !isResolved ? `
                    <div class="mt-4 text-center">
                        <button id="mark-resolved-btn" class="btn btn-primary" style="width: 100%; background-color: var(--success-color);">
                            Mark as Resolved
                        </button>
                    </div>
                ` : ''}
            `;

            // Add event listener for resolved button
            if (isOwner && !isResolved) {
                const resolveBtn = document.getElementById('mark-resolved-btn');
                if (resolveBtn) {
                    resolveBtn.addEventListener('click', async () => {
                        if (confirm('Are you sure you want to mark this item as resolved?')) {
                            try {
                                await updateItemStatus(item.id, 'resolved');
                                alert('Item marked as resolved!');
                                modal.classList.remove('active');
                                window.location.reload();
                            } catch (error) {
                                console.error(error);
                                alert('Error updating status: ' + error.message);
                            }
                        }
                    });
                }
            }
        } else {
            modalContent.innerHTML = '<p class="text-center">Item not found.</p>';
        }
    } catch (error) {
        console.error(error);
        modalContent.innerHTML = '<p class="text-center text-error">Error loading item details.</p>';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const authNav = document.getElementById('auth-nav');
    const itemsGrid = document.getElementById('items-grid');
    const modal = document.getElementById('item-modal');
    const closeModal = document.querySelector('.close-modal');

    // Auth State
    monitorAuthState((user) => {
        if (user) {
            authNav.innerHTML = `
                <span style="margin-right: 1rem;">${user.email}</span>
                <button id="logout-btn" class="btn btn-outline" style="padding: 0.5rem 1rem;">Logout</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', async () => {
                await logOut();
                window.location.reload();
            });

            // Show report buttons if on home page
            const actionButtons = document.getElementById('action-buttons');
            const loginPrompt = document.getElementById('login-prompt');
            if (actionButtons && loginPrompt) {
                actionButtons.style.display = 'flex';
                actionButtons.innerHTML = `
                    <a href="add-lost.html" class="btn btn-primary">Report Lost Item</a>
                    <a href="add-found.html" class="btn btn-outline">Report Found Item</a>
                `;
                loginPrompt.style.display = 'none';
            }
        } else {
            authNav.innerHTML = `
                <a href="login.html" class="btn btn-outline" style="margin-right: 0.5rem;">Login</a>
                <a href="signup.html" class="btn btn-primary">Sign Up</a>
            `;

            // Hide report buttons if on home page
            const actionButtons = document.getElementById('action-buttons');
            const loginPrompt = document.getElementById('login-prompt');
            if (actionButtons && loginPrompt) {
                actionButtons.style.display = 'none';
                loginPrompt.style.display = 'block';
            }
        }
    });

    // Load Items
    const loadItems = async () => {
        if (!itemsGrid) return; // Not on a page with items grid
        
        try {
            const pageType = itemsGrid.dataset.type; // 'all', 'lost', or 'found'
            const items = await getItems(pageType === 'all' ? null : pageType);
            
            if (items.length === 0) {
                itemsGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: var(--text-muted);">
                        <h3>No items found</h3>
                        <p>Be the first to report a ${pageType === 'all' ? 'lost or found' : pageType} item.</p>
                    </div>
                `;
            } else {
                itemsGrid.innerHTML = items.map(createItemCard).join('');
            }
        } catch (error) {
            console.error(error);
            itemsGrid.innerHTML = '<p class="text-center text-error">Error loading items.</p>';
        }
    };

    loadItems();

    // Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});

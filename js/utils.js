export const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export const createItemCard = (item) => {
    const badgeClass = item.type === 'lost' ? 'badge-lost' : 'badge-found';
    const badgeText = item.type === 'lost' ? 'Lost' : 'Found';
    
    return `
        <div class="card" onclick="openItemModal('${item.id}')">
            <div class="mb-4">
                <span class="badge ${badgeClass}">${badgeText}</span>
                <span style="float: right; color: var(--text-muted); font-size: 0.8rem;">
                    ${formatDate(item.createdAt)}
                </span>
            </div>
            <h3>${item.title}</h3>
            <p class="mt-2" style="color: var(--text-muted);">${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}</p>
            <div class="mt-4" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.9rem; color: var(--text-muted);">
                    📍 ${item.location}
                </span>
                <button class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                    View Details
                </button>
            </div>
        </div>
    `;
};

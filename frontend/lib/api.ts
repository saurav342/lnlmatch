// frontend/lib/api.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export async function fetchDashboardStats() {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
}

export async function fetchInvestors() {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/investors`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch investors');
    return res.json();
}

export async function fetchGrants() {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/grants`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch grants');
    return res.json();
}

export async function fetchCampaigns() {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/crm/campaigns`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch campaigns');
    return res.json();
}

export async function fetchUserProfile() {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
}

export async function toggleWishlist(investorId: string) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/wishlist/toggle`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ investorId })
    });
    if (!res.ok) throw new Error('Failed to toggle wishlist');
    return res.json();
}

export async function fetchWishlist() {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch wishlist');
    return res.json();
}

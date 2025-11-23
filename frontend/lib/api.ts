// frontend/lib/api.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export async function fetchDashboardStats() {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
}

export async function fetchInvestors() {
    const res = await fetch(`${API_BASE_URL}/investors`);
    if (!res.ok) throw new Error('Failed to fetch investors');
    return res.json();
}

export async function fetchGrants() {
    const res = await fetch(`${API_BASE_URL}/grants`);
    if (!res.ok) throw new Error('Failed to fetch grants');
    return res.json();
}

export async function fetchCampaigns() {
    const res = await fetch(`${API_BASE_URL}/crm/campaigns`);
    if (!res.ok) throw new Error('Failed to fetch campaigns');
    return res.json();
}

export async function fetchUserProfile() {
    const res = await fetch(`${API_BASE_URL}/user/profile`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
}

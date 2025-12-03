// lib/adminApi.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

// ============================================
// Dashboard APIs
// ============================================

export async function fetchAdminDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
}

export async function fetchActivityLog(params: {
    page?: number;
    limit?: number;
    action?: string;
    targetType?: string;
}) {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/activity-log?${queryParams}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch activity log');
    }

    return response.json();
}

// ============================================
// User Management APIs
// ============================================

export async function fetchAllUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    accountStatus?: string;
    userType?: string;
    startDate?: string;
    endDate?: string;
}) {
    const queryParams = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {} as Record<string, string>)
    ).toString();

    const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return response.json();
}

export async function fetchUserDetails(userId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user details');
    }

    return response.json();
}

export async function updateUserStatus(userId: string, accountStatus: string) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ accountStatus })
    });

    if (!response.ok) {
        throw new Error('Failed to update user status');
    }

    return response.json();
}

export async function exportUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users/export`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to export users');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

// ============================================
// Subscription Management APIs
// ============================================

export async function fetchAllSubscriptions(params: {
    page?: number;
    limit?: number;
    plan?: string;
    status?: string;
    search?: string;
}) {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_BASE_URL}/admin/subscriptions?${queryParams}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
    }

    return response.json();
}

export async function updateSubscription(subscriptionId: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/admin/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to update subscription');
    }

    return response.json();
}

export async function fetchRevenueAnalytics(params?: { startDate?: string; endDate?: string }) {
    const queryParams = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_BASE_URL}/admin/revenue/analytics?${queryParams}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch revenue analytics');
    }

    return response.json();
}

export async function exportSubscriptions() {
    const response = await fetch(`${API_BASE_URL}/admin/subscriptions/export`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to export subscriptions');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscriptions_export.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

// ============================================
// Investor Management APIs
// ============================================

export async function fetchAllInvestors(params: {
    page?: number;
    limit?: number;
    search?: string;
    industry?: string;
    location?: string;
    source?: string;
    isActive?: string;
    isVerified?: string;
}) {
    const queryParams = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {} as Record<string, string>)
    ).toString();

    const response = await fetch(`${API_BASE_URL}/admin/investors?${queryParams}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch investors');
    }

    return response.json();
}

export async function createInvestor(data: any) {
    const response = await fetch(`${API_BASE_URL}/admin/investors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to create investor');
    }

    return response.json();
}

export async function updateInvestor(investorId: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/admin/investors/${investorId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to update investor');
    }

    return response.json();
}

export async function deleteInvestor(investorId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/investors/${investorId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to delete investor');
    }

    return response.json();
}

export async function bulkDeleteInvestors(ids: string[]) {
    const response = await fetch(`${API_BASE_URL}/admin/investors/bulk-delete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids })
    });

    if (!response.ok) {
        throw new Error('Failed to delete investors');
    }

    return response.json();
}

export async function uploadInvestorsExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/admin/investors/upload-excel`, {
        method: 'POST',
        headers: {
            ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload Excel file');
    }

    return response.json();
}

export async function downloadInvestorTemplate() {
    const response = await fetch(`${API_BASE_URL}/admin/investors/template`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to download template');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investors_template.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

export async function exportInvestors() {
    const response = await fetch(`${API_BASE_URL}/admin/investors/export`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to export investors');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investors_export.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

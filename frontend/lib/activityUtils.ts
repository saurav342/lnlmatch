/**
 * Utility functions for activity log display
 */

interface Activity {
    action: string;
    targetType: string;
    adminId?: { name: string; email: string };
    actionDetails?: any;
    metadata?: any;
    timestamp: string;
}

/**
 * Generates a human-readable sentence from activity data
 */
export function generateActivitySentence(activity: Activity): string {
    const adminName = activity.adminId?.name || 'An admin';
    const action = activity.action;
    const targetType = activity.targetType;

    // Extract details from metadata or actionDetails
    const details = activity.actionDetails || {};
    const metadata = activity.metadata || {};

    switch (action) {
        // Potential Investor Actions
        case 'approve_potential_investor':
            const approvedName = getInvestorName(metadata) || 'an investor';
            return `${adminName} approved ${approvedName}`;

        case 'reject_potential_investor':
            const rejectedName = getInvestorName(metadata) || 'an investor';
            return `${adminName} rejected ${rejectedName}`;

        case 'update_potential_investor':
            const updatedPotentialName = getInvestorName(metadata) || 'an investor';
            return `${adminName} updated ${updatedPotentialName}`;

        case 'view_potential_investors':
            return `${adminName} viewed potential investors list`;

        case 'view_potential_investor_details':
            return `${adminName} viewed potential investor details`;

        // Investor Actions
        case 'create_investor':
            const createdName = getInvestorName(metadata) || 'a new investor';
            return `${adminName} created ${createdName}`;

        case 'update_investor':
            const investorName = getInvestorName(metadata) || 'an investor';
            return `${adminName} updated ${investorName}`;

        case 'delete_investor':
            const deletedName = getInvestorName(metadata) || 'an investor';
            return `${adminName} deleted ${deletedName}`;

        case 'bulk_delete_investors':
            const count = metadata?.count || 'multiple';
            return `${adminName} deleted ${count} investors`;

        case 'view_investors':
            return `${adminName} viewed investors list`;

        case 'upload_investors_file':
        case 'upload_investors_excel':
            const uploadCount = metadata?.count || 'investors';
            return `${adminName} uploaded ${uploadCount} via Excel`;

        case 'export_investors':
            return `${adminName} exported investors data`;

        // User Actions
        case 'view_users':
            return `${adminName} viewed users list`;

        case 'view_user_details':
            const userName = metadata?.body?.name || metadata?.userName || 'a user';
            return `${adminName} viewed ${userName}'s details`;

        case 'update_user_status':
            const userUpdated = metadata?.body?.name || 'a user';
            const newStatus = metadata?.body?.accountStatus || 'status';
            return `${adminName} changed ${userUpdated}'s status to ${newStatus}`;

        case 'export_users':
            return `${adminName} exported users data`;

        // Subscription Actions
        case 'view_subscriptions':
            return `${adminName} viewed subscriptions list`;

        case 'update_subscription':
            const subPlan = metadata?.body?.plan || 'subscription';
            return `${adminName} updated ${subPlan}`;

        case 'export_subscriptions':
            return `${adminName} exported subscriptions data`;

        case 'view_revenue_analytics':
            return `${adminName} viewed revenue analytics`;

        // Default
        default:
            return `${adminName} performed ${action.replace(/_/g, ' ')} on ${targetType}`;
    }
}

/**
 * Helper function to extract investor name from activity metadata
 */
function getInvestorName(metadata: any): string | null {
    if (!metadata) return null;

    // Try different paths where name might be stored
    const body = metadata.body || {};

    // Check for potential investor fields
    if (body.firstName || body.lastName) {
        return `${body.firstName || ''} ${body.lastName || ''}`.trim();
    }

    // Check for regular investor name
    if (body.name) {
        return body.name;
    }

    // Check for company name
    if (body.companyName) {
        return body.companyName;
    }

    // Check for email as fallback
    if (body.email) {
        return body.email;
    }

    return null;
}

/**
 * Formats activity timestamp in a user-friendly way
 */
export function formatActivityTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
}

/**
 * Returns appropriate color class for different action types
 */
export function getActionColor(action: string): string {
    if (action.includes('approve') || action.includes('create')) {
        return 'text-green-600 dark:text-green-400';
    } else if (action.includes('reject') || action.includes('delete')) {
        return 'text-red-600 dark:text-red-400';
    } else if (action.includes('update')) {
        return 'text-blue-600 dark:text-blue-400';
    } else if (action.includes('view') || action.includes('export')) {
        return 'text-gray-600 dark:text-gray-400';
    } else {
        return 'text-gray-700 dark:text-gray-300';
    }
}

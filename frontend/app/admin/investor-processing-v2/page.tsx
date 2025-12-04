'use client';

import React, { useState, useEffect } from 'react';
import { PotentialInvestor } from '../../../types/potentialInvestor';
import PotentialInvestorTable from '../../../components/admin/PotentialInvestorTable';
import PotentialInvestorModal from '../../../components/admin/PotentialInvestorModal';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { SectionHeader } from '../../../components/admin/SectionHeader';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

type InvestorStatus = 'pending' | 'verified' | 'rejected' | 'approved';

const TABS: { label: string; value: InvestorStatus; color: string }[] = [
    { label: 'Pending', value: 'pending', color: 'blue' },
    { label: 'Verified', value: 'verified', color: 'purple' },
    { label: 'Rejected', value: 'rejected', color: 'red' },
    // { label: 'Approved', value: 'approved', color: 'green' }
];

const InvestorProcessingV2Page = () => {
    const [activeTab, setActiveTab] = useState<InvestorStatus>('pending');
    const [investors, setInvestors] = useState<PotentialInvestor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromSerial, setFromSerial] = useState('');
    const [toSerial, setToSerial] = useState('');
    const [selectedInvestor, setSelectedInvestor] = useState<PotentialInvestor | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdvancing, setIsAdvancing] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 1 });
    const [isInitialized, setIsInitialized] = useState(false);

    // Load saved filter values on mount
    useEffect(() => {
        const savedFrom = localStorage.getItem('investorProcessingV2_fromSerial');
        const savedTo = localStorage.getItem('investorProcessingV2_toSerial');
        if (savedFrom) setFromSerial(savedFrom);
        if (savedTo) setToSerial(savedTo);
        setIsInitialized(true);
    }, []);

    // Save filter values when they change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('investorProcessingV2_fromSerial', fromSerial);
        }
    }, [fromSerial, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('investorProcessingV2_toSerial', toSerial);
        }
    }, [toSerial, isInitialized]);

    const fetchInvestors = async (status?: InvestorStatus) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const currentStatus = status || activeTab;
            const res = await fetch(`${API_BASE_URL}/admin/potential-investors-v2?page=${pagination.page}&limit=${pagination.limit}&search=${searchQuery}&status=${currentStatus}&fromSerial=${fromSerial}&toSerial=${toSerial}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setInvestors(data.data);
                setPagination(data.pagination);
            } else {
                toast.error(data.message || 'Failed to fetch investors');
            }
        } catch (error) {
            console.error('Error fetching investors:', error);
            toast.error('Failed to fetch investors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isInitialized) {
            fetchInvestors();
        }
    }, [pagination.page, searchQuery, activeTab, isInitialized]);

    const handleTabChange = (status: InvestorStatus) => {
        setActiveTab(status);
        setPagination(prev => ({ ...prev, page: 1 }));
        setSearchQuery('');
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleFilterGo = () => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchInvestors();
    };

    const handleView = (investor: PotentialInvestor) => {
        setSelectedInvestor(investor);
        setIsModalOpen(true);
    };

    const advanceToNext = async () => {
        setIsAdvancing(true);

        // Wait 200ms
        await new Promise(resolve => setTimeout(resolve, 200));

        // Refresh the list
        await fetchInvestors();

        // Find the next investor in the list
        if (investors.length > 0) {
            const currentIndex = investors.findIndex(inv => inv._id === selectedInvestor?._id);
            let nextInvestor: PotentialInvestor | null = null;

            if (currentIndex >= 0 && currentIndex < investors.length - 1) {
                // Get next in current list
                nextInvestor = investors[currentIndex + 1];
            } else if (investors.length > 0) {
                // Get first investor from refreshed list
                nextInvestor = investors[0];
            }

            if (nextInvestor && nextInvestor._id !== selectedInvestor?._id) {
                setSelectedInvestor(nextInvestor);
            } else {
                // No more investors, close modal
                setIsModalOpen(false);
                setSelectedInvestor(null);
            }
        } else {
            // No investors left, close modal
            setIsModalOpen(false);
            setSelectedInvestor(null);
        }

        setIsAdvancing(false);
    };

    const handleApprove = async (id: string) => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/admin/potential-investors-v2/${id}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Investor approved successfully');
                await advanceToNext();
            } else {
                toast.error(data.message || 'Failed to approve investor');
            }
        } catch (error) {
            console.error('Error approving investor:', error);
            toast.error('Failed to approve investor');
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('Are you sure you want to reject this investor?')) return;

        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/admin/potential-investors-v2/${id}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Investor rejected successfully');
                await advanceToNext();
            } else {
                toast.error(data.message || 'Failed to reject investor');
            }
        } catch (error) {
            console.error('Error rejecting investor:', error);
            toast.error('Failed to reject investor');
        }
    };

    const handleUpdate = async (id: string, updateData: Partial<PotentialInvestor>) => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/admin/potential-investors-v2/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Investor updated successfully');
                await advanceToNext();
            } else {
                toast.error(data.message || 'Failed to update investor');
            }
        } catch (error) {
            console.error('Error updating investor:', error);
            toast.error('Failed to update investor');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <SectionHeader
                    title="Investor Processing V2"
                    description="Review and approve potential investors (Grants)"
                />

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8">
                        {TABS.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                    ${activeTab === tab.value
                                        ? `border-${tab.color}-500 text-${tab.color}-600 dark:text-${tab.color}-400`
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }
                                `}
                                style={{
                                    borderBottomColor: activeTab === tab.value ?
                                        (tab.color === 'blue' ? '#3b82f6' :
                                            tab.color === 'purple' ? '#a855f7' :
                                                tab.color === 'green' ? '#10b981' : '#ef4444')
                                        : undefined,
                                    color: activeTab === tab.value ?
                                        (tab.color === 'blue' ? '#3b82f6' :
                                            tab.color === 'purple' ? '#a855f7' :
                                                tab.color === 'green' ? '#10b981' : '#ef4444')
                                        : undefined
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by company, name, or email..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Serial Number Filter */}
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500 font-medium ml-1">From</span>
                            <input
                                type="text"
                                placeholder="AB0000"
                                value={fromSerial}
                                onChange={(e) => setFromSerial(e.target.value)}
                                className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500 font-medium ml-1">To</span>
                            <input
                                type="text"
                                placeholder="AB9999"
                                value={toSerial}
                                onChange={(e) => setToSerial(e.target.value)}
                                className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            />
                        </div>
                        <button
                            onClick={handleFilterGo}
                            className="mb-[1px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Go
                        </button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : investors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <p className="text-lg font-medium">No {activeTab} investors found</p>
                        <p className="text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <>
                        <PotentialInvestorTable
                            investors={investors}
                            onView={handleView}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />

                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                    disabled={pagination.page === 1}
                                    className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <PotentialInvestorModal
                        investor={selectedInvestor}
                        isOpen={isModalOpen}
                        isAdvancing={isAdvancing}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedInvestor(null);
                        }}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onUpdate={handleUpdate}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default InvestorProcessingV2Page;

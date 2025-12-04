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
            <div className="space-y-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Investor Processing V2
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Review and approve potential investors from the Grants, Angel, and Institutional lists.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-6">
                        <nav className="-mb-px flex space-x-8">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleTabChange(tab.value)}
                                    className={`
                                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                                        ${activeTab === tab.value
                                            ? `border-${tab.color}-500 text-${tab.color}-600 dark:text-${tab.color}-400`
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                        }
                                    `}
                                    style={{
                                        borderColor: activeTab === tab.value ?
                                            (tab.color === 'blue' ? '#3b82f6' :
                                                tab.color === 'purple' ? '#a855f7' :
                                                    tab.color === 'green' ? '#10b981' : '#ef4444')
                                            : undefined,
                                        color: activeTab === tab.value ?
                                            (tab.color === 'blue' ? '#2563eb' :
                                                tab.color === 'purple' ? '#9333ea' :
                                                    tab.color === 'green' ? '#059669' : '#dc2626')
                                            : undefined
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                            {/* Search */}
                            <div className="relative w-full xl:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search companies, names, emails..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex items-center gap-3 w-full xl:w-auto bg-gray-50 dark:bg-gray-900 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                <span className="text-xs font-medium text-gray-500 px-2 uppercase tracking-wider">Serial No.</span>
                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1" />
                                <input
                                    type="text"
                                    placeholder="From (AB...)"
                                    value={fromSerial}
                                    onChange={(e) => setFromSerial(e.target.value)}
                                    className="w-28 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                />
                                <span className="text-gray-400 text-sm">-</span>
                                <input
                                    type="text"
                                    placeholder="To (AB...)"
                                    value={toSerial}
                                    onChange={(e) => setToSerial(e.target.value)}
                                    className="w-28 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                />
                                <button
                                    onClick={handleFilterGo}
                                    className="ml-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="bg-white dark:bg-gray-800 min-h-[400px]">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : investors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">No investors found</p>
                                <p className="text-sm mt-1 text-gray-500">Try adjusting your search or filters</p>
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
                                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Showing <span className="font-medium text-gray-900 dark:text-white">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium text-gray-900 dark:text-white">{pagination.total}</span> results
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                            disabled={pagination.page === 1}
                                            className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all text-sm font-medium"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                                            disabled={pagination.page === pagination.pages}
                                            className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all text-sm font-medium"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

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

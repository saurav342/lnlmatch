'use client';

import React, { useState, useEffect } from 'react';
import { PotentialInvestor } from '../../../types/potentialInvestor';
import PotentialInvestorTable from '../../../components/admin/PotentialInvestorTable';
import PotentialInvestorModal from '../../../components/admin/PotentialInvestorModal';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { SectionHeader } from '../../../components/admin/SectionHeader';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    fetchPotentialInvestors,
    updatePotentialInvestor,
    approvePotentialInvestor,
    rejectPotentialInvestor,
    deletePotentialInvestor
} from '../../../lib/adminApi';

const InvestorProcessingPage = () => {
    const [investors, setInvestors] = useState<PotentialInvestor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeBatch, setActiveBatch] = useState<'P1' | 'B1'>('P1');
    const [activeTab, setActiveTab] = useState<'pending' | 'reviewed' | 'rejected'>('pending');
    const [selectedInvestor, setSelectedInvestor] = useState<PotentialInvestor | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 1 });

    const loadInvestors = async () => {
        try {
            setLoading(true);
            const data = await fetchPotentialInvestors({
                page: pagination.page,
                limit: pagination.limit,
                search: searchQuery,
                status: activeTab,
                batch: activeBatch
            });

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
        loadInvestors();
    }, [pagination.page, searchQuery, activeTab, activeBatch]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleView = (investor: PotentialInvestor) => {
        setSelectedInvestor(investor);
        setIsModalOpen(true);
    };

    const handleApprove = async (id: string) => {
        try {
            const data = await approvePotentialInvestor(id);
            if (data.success) {
                toast.success('Investor approved successfully');
                // Don't close modal, update local state to show verified status
                if (selectedInvestor) {
                    setSelectedInvestor({ ...selectedInvestor, status: 'approved' });
                }
                loadInvestors(); // Refresh background list
            } else {
                toast.error(data.message || 'Failed to approve investor');
            }
        } catch (error) {
            console.error('Error approving investor:', error);
            toast.error('Failed to approve investor');
        }
    };

    const handleReject = async (id: string) => {
        // Soft reject - move to rejected list
        try {
            const data = await rejectPotentialInvestor(id);
            if (data.success) {
                toast.success('Investor moved to rejected list');
                setIsModalOpen(false);
                loadInvestors();
            } else {
                toast.error(data.message || 'Failed to reject investor');
            }
        } catch (error) {
            console.error('Error rejecting investor:', error);
            toast.error('Failed to reject investor');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this investor? This action cannot be undone.')) return;

        try {
            const data = await deletePotentialInvestor(id);
            if (data.success) {
                toast.success('Investor deleted permanently');
                setIsModalOpen(false);
                loadInvestors();
            } else {
                toast.error(data.message || 'Failed to delete investor');
            }
        } catch (error) {
            console.error('Error deleting investor:', error);
            toast.error('Failed to delete investor');
        }
    };

    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpdate = async (id: string, updateData: Partial<PotentialInvestor>) => {
        try {
            setIsProcessing(true);

            // If updating, set status to 'reviewed' if it's currently 'pending'
            const dataToUpdate = {
                ...updateData,
                status: selectedInvestor?.status === 'pending' ? 'reviewed' : selectedInvestor?.status
            };

            const data = await updatePotentialInvestor(id, dataToUpdate);

            if (data.success) {
                toast.success('Investor updated successfully');

                // Wait for 200ms
                await new Promise(resolve => setTimeout(resolve, 200));

                // Refresh list and find next investor
                const currentIndex = investors.findIndex(inv => inv._id === id);

                // Fetch fresh data
                const freshData = await fetchPotentialInvestors({
                    page: pagination.page,
                    limit: pagination.limit,
                    search: searchQuery,
                    status: activeTab,
                    batch: activeBatch
                });

                if (freshData.success) {
                    setInvestors(freshData.data);
                    setPagination(freshData.pagination);

                    // Determine next investor
                    // If we are in 'pending' tab, the updated item is removed, so the item at currentIndex is now the next one
                    // If we are in 'reviewed' or 'rejected' tab, the item stays, so we want currentIndex + 1
                    let nextIndex = (activeTab === 'pending' || activeTab === 'rejected') ? currentIndex : currentIndex + 1;

                    // Bounds check
                    if (nextIndex >= freshData.data.length) {
                        nextIndex = 0; // Wrap around or handle end of list
                    }

                    if (freshData.data.length > 0) {
                        setSelectedInvestor(freshData.data[nextIndex]);
                    } else {
                        setIsModalOpen(false); // No more items
                    }
                }
            } else {
                toast.error(data.message || 'Failed to update investor');
            }
        } catch (error) {
            console.error('Error updating investor:', error);
            toast.error('Failed to update investor');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <SectionHeader
                    title="Investor Processing"
                    description="Review and approve potential investors from CSV imports"
                />

                {/* Batch Selector */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
                    <div className="flex gap-3">
                        <button
                            onClick={() => { setActiveBatch('P1'); setPagination(prev => ({ ...prev, page: 1 })); }}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeBatch === 'P1'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Investor - P1
                        </button>
                        <button
                            onClick={() => { setActiveBatch('B1'); setPagination(prev => ({ ...prev, page: 1 })); }}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeBatch === 'B1'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Investor - B1
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => { setActiveTab('pending'); setPagination(prev => ({ ...prev, page: 1 })); }}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => { setActiveTab('reviewed'); setPagination(prev => ({ ...prev, page: 1 })); }}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reviewed'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Reviewed
                    </button>
                    <button
                        onClick={() => { setActiveTab('rejected'); setPagination(prev => ({ ...prev, page: 1 })); }}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'rejected'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Rejected
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by company, name, or email..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <>
                        <PotentialInvestorTable
                            investors={investors}
                            onView={handleView}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onDelete={handleDelete}
                            activeTab={activeTab}
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
                <PotentialInvestorModal
                    investor={selectedInvestor}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    isLoading={isProcessing}
                    isRejectedTab={activeTab === 'rejected'}
                />
            </div>
        </AdminLayout>
    );
};

export default InvestorProcessingPage;

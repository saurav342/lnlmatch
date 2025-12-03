'use client';

import React, { useState, useEffect } from 'react';
import { PotentialInvestor } from '../../../types/potentialInvestor';
import PotentialInvestorTable from '../../../components/admin/PotentialInvestorTable';
import PotentialInvestorModal from '../../../components/admin/PotentialInvestorModal';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { SectionHeader } from '../../../components/admin/SectionHeader';
import { Search, Filter, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const InvestorProcessingPage = () => {
    const [investors, setInvestors] = useState<PotentialInvestor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInvestor, setSelectedInvestor] = useState<PotentialInvestor | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 1 });

    const fetchInvestors = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/potential-investors?page=${pagination.page}&limit=${pagination.limit}&search=${searchQuery}`, {
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
        fetchInvestors();
    }, [pagination.page, searchQuery]);

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
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/potential-investors/${id}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Investor approved successfully');
                setIsModalOpen(false);
                fetchInvestors();
            } else {
                toast.error(data.message || 'Failed to approve investor');
            }
        } catch (error) {
            console.error('Error approving investor:', error);
            toast.error('Failed to approve investor');
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('Are you sure you want to reject and delete this investor?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/potential-investors/${id}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Investor rejected successfully');
                setIsModalOpen(false);
                fetchInvestors();
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
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/potential-investors/${id}`, {
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
                setSelectedInvestor(data.data); // Update local state for modal
                fetchInvestors(); // Refresh list
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
                    title="Investor Processing"
                    description="Review and approve potential investors from CSV imports"
                />

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
                    onUpdate={handleUpdate}
                />
            </div>
        </AdminLayout>
    );
};

export default InvestorProcessingPage;

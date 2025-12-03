import React from 'react';
import { PotentialInvestor } from '../../types/potentialInvestor';
import { Eye, Edit, Check, Trash2 } from 'lucide-react';

interface PotentialInvestorTableProps {
    investors: PotentialInvestor[];
    onView: (investor: PotentialInvestor) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onDelete: (id: string) => void;
    activeTab?: 'pending' | 'reviewed' | 'rejected';
}

const PotentialInvestorTable: React.FC<PotentialInvestorTableProps> = ({
    investors,
    onView,
    onApprove,
    onReject,
    onDelete,
    activeTab = 'pending'
}) => {
    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Industry / Stage</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {investors.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                No {activeTab} investors found.
                            </td>
                        </tr>
                    ) : (
                        investors.map((investor) => (
                            <tr
                                key={investor._id}
                                onClick={() => onView(investor)}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">{investor.companyName || 'N/A'}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                        {investor.website}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {investor.firstName} {investor.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{investor.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 dark:text-white">{investor.industry || '-'}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{investor.stageOfInvestment}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${investor.status === 'reviewed'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                        : investor.status === 'rejected'
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                        {investor.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onView(investor); }}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        {activeTab !== 'rejected' && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onApprove(investor._id); }}
                                                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onReject(investor._id); }}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}

                                        {activeTab === 'rejected' && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onApprove(investor._id); }}
                                                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(investor._id); }}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete Permanently"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PotentialInvestorTable;

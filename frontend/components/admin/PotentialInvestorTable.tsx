import React from 'react';
import { PotentialInvestor } from '../../types/potentialInvestor';
import { Eye, Edit, Check, Trash2 } from 'lucide-react';

interface PotentialInvestorTableProps {
    investors: PotentialInvestor[];
    onView: (investor: PotentialInvestor) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const PotentialInvestorTable: React.FC<PotentialInvestorTableProps> = ({
    investors,
    onView,
    onApprove,
    onReject
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                        <th className="px-6 py-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Serial No.</th>
                        <th className="px-6 py-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Industry / Stage</th>
                        <th className="px-6 py-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Status</th>
                        <th className="px-6 py-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right w-40">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {investors.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                No pending investors found.
                            </td>
                        </tr>
                    ) : (
                        investors.map((investor) => (
                            <tr key={investor._id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200">
                                <td className="px-6 py-5">
                                    <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-fit">
                                        {investor.serialNumber || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="font-semibold text-gray-900 dark:text-white text-base mb-0.5">{investor.companyName || 'N/A'}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] hover:text-blue-600 transition-colors">
                                        <a href={investor.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                            {investor.website}
                                        </a>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {investor.firstName} {investor.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{investor.email}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{investor.industry || '-'}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                        {investor.stageOfInvestment}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`
                                        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                        ${investor.status === 'pending' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                                        ${investor.status === 'verified' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                                        ${investor.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                                        ${investor.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                                    `}>
                                        {investor.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => onView(investor)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onApprove(investor._id)}
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
                                            title="Approve"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onReject(investor._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                            title="Reject"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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

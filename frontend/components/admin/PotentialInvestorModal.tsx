import React, { useState, useEffect } from 'react';
import { PotentialInvestor } from '../../types/potentialInvestor';
import { X, Check, Trash2, ExternalLink, Save, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface PotentialInvestorModalProps {
    investor: PotentialInvestor | null;
    isOpen: boolean;
    isAdvancing?: boolean;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onUpdate: (id: string, data: Partial<PotentialInvestor>) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    hasNext?: boolean;
    hasPrevious?: boolean;
}

const PotentialInvestorModal: React.FC<PotentialInvestorModalProps> = ({
    investor,
    isOpen,
    isAdvancing = false,
    onClose,
    onApprove,
    onReject,
    onUpdate,
    onNext,
    onPrevious,
    hasNext = false,
    hasPrevious = false
}) => {
    const [formData, setFormData] = useState<Partial<PotentialInvestor>>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (investor) {
            setFormData(investor);
            setIsEditing(false);
        }
    }, [investor]);

    if (!isOpen || !investor) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onUpdate(investor._id, formData);
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {isEditing ? 'Edit Investor Details' : 'Investor Details'}
                            </h2>
                            {investor.serialNumber && (
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-mono text-sm font-semibold">
                                    {investor.serialNumber}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Review and process this potential investor
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mr-2">
                            <button
                                onClick={onPrevious}
                                disabled={!hasPrevious}
                                className={`p-1 rounded-md transition-colors ${hasPrevious
                                        ? 'hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-sm'
                                        : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                    }`}
                                title="Previous Investor"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
                            <button
                                onClick={onNext}
                                disabled={!hasNext}
                                className={`p-1 rounded-md transition-colors ${hasNext
                                        ? 'hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-sm'
                                        : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                    }`}
                                title="Next Investor"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Company Info</h3>
                            <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} isEditing={isEditing} />
                            <InputField label="Website" name="website" value={formData.website} onChange={handleChange} isEditing={isEditing} isLink />
                            <InputField label="Company LinkedIn" name="companyLinkedinUrl" value={formData.companyLinkedinUrl} onChange={handleChange} isEditing={isEditing} isLink />
                            <InputField label="Twitter" name="twitterUrl" value={formData.twitterUrl} onChange={handleChange} isEditing={isEditing} isLink />
                            <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} isEditing={isEditing} />
                            <InputField label="Stage" name="stageOfInvestment" value={formData.stageOfInvestment} onChange={handleChange} isEditing={isEditing} />
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Contact Info</h3>
                            <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} isEditing={isEditing} />
                            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} isEditing={isEditing} />
                            <InputField label="Email" name="email" value={formData.email} onChange={handleChange} isEditing={isEditing} />
                            <InputField label="Person LinkedIn" name="personLinkedinUrl" value={formData.personLinkedinUrl} onChange={handleChange} isEditing={isEditing} isLink />
                            <InputField label="Authentic" name="authentic" value={formData.authentic} onChange={handleChange} isEditing={isEditing} />
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2 space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Notes</h3>
                            {isEditing ? (
                                <textarea
                                    name="notes"
                                    value={formData.notes || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            ) : (
                                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    {formData.notes || 'No notes available.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                Edit Details
                            </button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => onReject(investor._id)}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Reject
                        </button>
                        <button
                            onClick={() => onApprove(investor._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                        >
                            <Check className="w-4 h-4" />
                            Approve & Add
                        </button>
                    </div>
                </div>

                {/* Loading Overlay for Auto-Advance */}
                {isAdvancing && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                        <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-4 shadow-xl flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            <span className="text-gray-900 dark:text-white font-medium">Moving to next investor...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface InputFieldProps {
    label: string;
    name: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isEditing: boolean;
    isLink?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, isEditing, isLink }) => {
    if (isEditing) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                <input
                    type="text"
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>
        );
    }

    return (
        <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
            <div className="mt-1 text-gray-900 dark:text-white font-medium flex items-center gap-2">
                {value || '-'}
                {isLink && value && (
                    <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default PotentialInvestorModal;

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    fetchAllInvestors,
    uploadInvestorsExcel,
    downloadInvestorTemplate,
    exportInvestors,
    deleteInvestor
} from "@/lib/adminApi";
import {
    Upload,
    Download,
    FileSpreadsheet,
    Search,
    ChevronLeft,
    ChevronRight,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle
} from "lucide-react";

export default function AdminInvestorsPage() {
    const [investors, setInvestors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        source: "",
        isActive: ""
    });

    // Upload modal state
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadInvestors();
    }, [page, filters]);

    const loadInvestors = async () => {
        setLoading(true);
        try {
            const response = await fetchAllInvestors({
                page,
                limit: 20,
                search,
                ...filters
            });

            if (response.success) {
                setInvestors(response.data);
                setTotalPages(response.pagination.pages);
            }
        } catch (error) {
            console.error("Failed to load investors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        loadInvestors();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
            setUploadResult(null);
        }
    };

    const handleUpload = async () => {
        if (!uploadFile) return;

        setUploading(true);
        setUploadResult(null);

        try {
            const response = await uploadInvestorsExcel(uploadFile);
            setUploadResult(response);

            if (response.success) {
                // Reload investors list
                loadInvestors();
            }
        } catch (error: any) {
            setUploadResult({
                success: false,
                message: error.message || "Failed to upload file"
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            await downloadInvestorTemplate();
        } catch (error) {
            console.error("Failed to download template:", error);
            alert("Failed to download template");
        }
    };

    const handleExport = async () => {
        try {
            await exportInvestors();
        } catch (error) {
            console.error("Failed to export investors:", error);
            alert("Failed to export investors");
        }
    };

    const handleDelete = async (investorId: string) => {
        if (!confirm("Are you sure you want to delete this investor?")) return;

        try {
            await deleteInvestor(investorId);
            loadInvestors();
        } catch (error) {
            console.error("Failed to delete investor:", error);
            alert("Failed to delete investor");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/dashboard">
                            <Button variant="ghost" size="sm" className="mb-2">
                                ← Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">Investor Database</h1>
                        <p className="text-muted-foreground">Upload and manage investor data</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleExport} variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button onClick={() => setUploadModalOpen(true)} className="gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Excel
                        </Button>
                    </div>
                </div>

                {/* Excel Upload Section */}
                <Card className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-orange-200 dark:border-orange-800">
                    <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                            <FileSpreadsheet className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">Bulk Import Investors</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Upload an Excel file with investor data to import multiple investors at once.
                            </p>
                            <div className="flex gap-2 mt-3">
                                <Button onClick={() => setUploadModalOpen(true)} size="sm">
                                    Upload Excel File
                                </Button>
                                <Button onClick={handleDownloadTemplate} variant="outline" size="sm" className="gap-2">
                                    <Download className="h-3 w-3" />
                                    Download Template
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Filters */}
                <Card className="p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search by name, email, or company..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <Button onClick={handleSearch}>
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>

                        <Select
                            value={filters.source}
                            onValueChange={(value) => setFilters({ ...filters, source: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Sources" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Sources</SelectItem>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="excel-import">Excel Import</SelectItem>
                                <SelectItem value="api">API</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.isActive}
                            onValueChange={(value) => setFilters({ ...filters, isActive: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card>

                {/* Investors Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Industries</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        Loading investors...
                                    </TableCell>
                                </TableRow>
                            ) : investors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        No investors found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                investors.map((investor) => (
                                    <TableRow key={investor._id}>
                                        <TableCell className="font-medium">{investor.name}</TableCell>
                                        <TableCell>{investor.email}</TableCell>
                                        <TableCell>{investor.company || "-"}</TableCell>
                                        <TableCell>{investor.location || "-"}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {investor.industries?.slice(0, 2).map((ind: string, i: number) => (
                                                    <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {ind}
                                                    </span>
                                                ))}
                                                {investor.industries?.length > 2 && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                                        +{investor.industries.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="capitalize text-xs">{investor.source}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(investor._id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Upload Modal */}
            <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Upload Investors Excel</DialogTitle>
                        <DialogDescription>
                            Select an Excel file (.xlsx or .xls) containing investor data to import.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div
                            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm font-medium">
                                {uploadFile ? uploadFile.name : "Click to select Excel file"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                or drag and drop here
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {uploadResult && (
                            <div className={`p-4 rounded-lg ${uploadResult.success ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}>
                                <div className="flex items-start gap-2">
                                    {uploadResult.success ? (
                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <p className={`font-medium text-sm ${uploadResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                                            {uploadResult.message}
                                        </p>
                                        {uploadResult.stats && (
                                            <div className="mt-2 text-xs space-y-1">
                                                <p>Total rows: {uploadResult.stats.totalRows}</p>
                                                <p>Valid rows: {uploadResult.stats.validRows}</p>
                                                <p>Invalid rows: {uploadResult.stats.invalidRows}</p>
                                                {uploadResult.stats.inserted > 0 && (
                                                    <p className="font-medium text-green-700 dark:text-green-300">
                                                        Successfully imported: {uploadResult.stats.inserted}
                                                    </p>
                                                )}
                                                {uploadResult.stats.duplicates > 0 && (
                                                    <p className="text-orange-700 dark:text-orange-300">
                                                        Duplicates skipped: {uploadResult.stats.duplicates}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        {uploadResult.errors && uploadResult.errors.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-xs font-medium mb-1">Errors:</p>
                                                <div className="max-h-32 overflow-y-auto text-xs space-y-0.5">
                                                    {uploadResult.errors.slice(0, 10).map((error: string, i: number) => (
                                                        <p key={i} className="text-red-700 dark:text-red-300">• {error}</p>
                                                    ))}
                                                    {uploadResult.errors.length > 10 && (
                                                        <p className="text-red-700 dark:text-red-300">... and {uploadResult.errors.length - 10} more</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button
                                onClick={handleUpload}
                                disabled={!uploadFile || uploading}
                                className="flex-1"
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setUploadModalOpen(false);
                                    setUploadFile(null);
                                    setUploadResult(null);
                                }}
                            >
                                Close
                            </Button>
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>• Maximum file size: 10MB</p>
                            <p>• Required columns: name, email</p>
                            <p>• Download the template for correct format</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

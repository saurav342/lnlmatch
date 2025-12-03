import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { API_BASE_URL } from "@/lib/api";

interface ExcelUploadModalProps {
    onSuccess: () => void;
}

export function ExcelUploadModal({ onSuccess }: ExcelUploadModalProps) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setProgress(10); // Start progress
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/investors/upload`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            setProgress(60);

            const data = await response.json();

            if (response.ok) {
                setProgress(100);
                setResult(data.stats);
                if (data.errors && data.errors.length > 0) {
                    setError("Some rows failed to process");
                }
                onSuccess();
            } else {
                throw new Error(data.message || "Upload failed");
            }
        } catch (err: any) {
            setError(err.message);
            setProgress(0);
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setFile(null);
        setResult(null);
        setError(null);
        setProgress(0);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Import Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Import Investors</DialogTitle>
                    <DialogDescription>
                        Upload an Excel file (.xlsx) to bulk add or update investors.
                        <br />
                        <span className="text-xs text-muted-foreground">
                            Supports "Angel Investors" and "Institutional Investors" sheets.
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="file">Excel File</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </div>

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Uploading...</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {result && (
                        <Alert className="border-green-500/50 bg-green-500/10 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>Upload Complete</AlertTitle>
                            <AlertDescription>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                    <div>Processed: {result.processed}</div>
                                    <div>Created: {result.created}</div>
                                    <div>Updated: {result.updated}</div>
                                    <div>Errors: {result.errors}</div>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        {result ? "Close" : "Cancel"}
                    </Button>
                    {!result && (
                        <Button onClick={handleUpload} disabled={!file || uploading}>
                            {uploading ? "Uploading..." : "Upload"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

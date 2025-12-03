import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface InvestorModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "view" | "edit" | "create";
    investor?: any;
    onSave: (data: any) => Promise<void>;
}

export function InvestorModal({
    isOpen,
    onClose,
    mode,
    investor,
    onSave,
}: InvestorModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        location: "",
        ticketSizeMin: "",
        ticketSizeMax: "",
        industries: "",
        investmentStage: "",
        linkedinUrl: "",
        websiteUrl: "",
        notes: "",
        isActive: true,
        isVerified: false,
    });

    useEffect(() => {
        if (investor && (mode === "view" || mode === "edit")) {
            setFormData({
                name: investor.name || "",
                email: investor.email || "",
                company: investor.company || "",
                location: investor.location || "",
                ticketSizeMin: investor.ticketSize?.min?.toString() || "0",
                ticketSizeMax: investor.ticketSize?.max?.toString() || "0",
                industries: Array.isArray(investor.industries)
                    ? investor.industries.join(", ")
                    : investor.industries || "",
                investmentStage: Array.isArray(investor.investmentStage)
                    ? investor.investmentStage[0] || ""
                    : investor.investmentStage || "",
                linkedinUrl: investor.linkedinUrl || "",
                websiteUrl: investor.websiteUrl || "",
                notes: investor.notes || "",
                isActive: investor.isActive ?? true,
                isVerified: investor.isVerified ?? false,
            });
        } else {
            // Reset form for create mode
            setFormData({
                name: "",
                email: "",
                company: "",
                location: "",
                ticketSizeMin: "",
                ticketSizeMax: "",
                industries: "",
                investmentStage: "",
                linkedinUrl: "",
                websiteUrl: "",
                notes: "",
                isActive: true,
                isVerified: false,
            });
        }
    }, [investor, mode, isOpen]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Format data for backend
            const payload = {
                ...formData,
                ticketSize: {
                    min: Number(formData.ticketSizeMin) || 0,
                    max: Number(formData.ticketSizeMax) || 0,
                },
                industries: formData.industries
                    .split(",")
                    .map((i) => i.trim())
                    .filter((i) => i),
                investmentStage: formData.investmentStage ? [formData.investmentStage] : [],
            };

            // Remove temporary fields
            delete (payload as any).ticketSizeMin;
            delete (payload as any).ticketSizeMax;

            await onSave(payload);
            onClose();
        } catch (error) {
            console.error("Failed to save investor:", error);
        } finally {
            setLoading(false);
        }
    };

    const isReadOnly = mode === "view";
    const title =
        mode === "create"
            ? "Add New Investor"
            : mode === "edit"
                ? "Edit Investor"
                : "Investor Details";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Add a new investor to the platform."
                            : mode === "edit"
                                ? "Update investor information."
                                : "View investor details."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                disabled={isReadOnly}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                disabled={isReadOnly || mode === "edit"} // Email usually immutable or requires special handling
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) => handleChange("company", e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleChange("location", e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ticketSizeMin">Min Ticket Size ($)</Label>
                            <Input
                                id="ticketSizeMin"
                                type="number"
                                value={formData.ticketSizeMin}
                                onChange={(e) => handleChange("ticketSizeMin", e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ticketSizeMax">Max Ticket Size ($)</Label>
                            <Input
                                id="ticketSizeMax"
                                type="number"
                                value={formData.ticketSizeMax}
                                onChange={(e) => handleChange("ticketSizeMax", e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="industries">Industries (comma separated)</Label>
                            <Input
                                id="industries"
                                value={formData.industries}
                                onChange={(e) => handleChange("industries", e.target.value)}
                                disabled={isReadOnly}
                                placeholder="e.g. SaaS, Fintech, AI"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="investmentStage">Investment Stage</Label>
                            <Select
                                value={formData.investmentStage}
                                onValueChange={(val) => handleChange("investmentStage", val)}
                                disabled={isReadOnly}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                                    <SelectItem value="seed">Seed</SelectItem>
                                    <SelectItem value="series-a">Series A</SelectItem>
                                    <SelectItem value="series-b">Series B</SelectItem>
                                    <SelectItem value="series-c">Series C</SelectItem>
                                    <SelectItem value="growth">Growth</SelectItem>
                                    <SelectItem value="late-stage">Late Stage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                            <Input
                                id="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="websiteUrl">Website URL</Label>
                            <Input
                                id="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={(e) => handleChange("websiteUrl", e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                disabled={isReadOnly}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-8 pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => handleChange("isActive", checked)}
                                disabled={isReadOnly}
                            />
                            <Label htmlFor="isActive">Active Status</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="isVerified"
                                checked={formData.isVerified}
                                onCheckedChange={(checked) => handleChange("isVerified", checked)}
                                disabled={isReadOnly}
                            />
                            <Label htmlFor="isVerified">Verified Investor</Label>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {mode === "view" ? "Close" : "Cancel"}
                        </Button>
                        {mode !== "view" && (
                            <Button type="submit" disabled={loading} className="bg-[var(--admin-mid)] text-gray-900 hover:bg-[var(--admin-strong)]">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {mode === "create" ? "Create Investor" : "Save Changes"}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

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
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Mail, Linkedin, ChevronDown, ChevronUp, Building2, Globe, MapPin, Tag, Users, Briefcase, ExternalLink } from "lucide-react";

interface TeamMember {
    _id?: string;
    name: string;
    role?: string;
    email?: string;
    linkedinUrl?: string;
}

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
    const [showAllTeamMembers, setShowAllTeamMembers] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        location: "",
        ticketSizeMin: "",
        ticketSizeMax: "",
        industries: "",
        investmentStage: "",
        investmentStages: [] as string[],
        linkedinUrl: "",
        websiteUrl: "",
        notes: "",
        isActive: true,
        isVerified: false,
        type: "",
        serialNumber: "",
        source: "",
        tags: [] as string[],
        regionalFocus: [] as string[],
        teamMembers: [] as TeamMember[],
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
                investmentStages: Array.isArray(investor.investmentStage)
                    ? investor.investmentStage
                    : investor.investmentStage ? [investor.investmentStage] : [],
                linkedinUrl: investor.linkedinUrl || "",
                websiteUrl: investor.websiteUrl || "",
                notes: investor.notes || "",
                isActive: investor.isActive ?? true,
                isVerified: investor.isVerified ?? false,
                type: investor.type || "",
                serialNumber: investor.serialNumber || "",
                source: investor.source || "",
                tags: Array.isArray(investor.tags) ? investor.tags : [],
                regionalFocus: Array.isArray(investor.regionalFocus) ? investor.regionalFocus : [],
                teamMembers: Array.isArray(investor.teamMembers) ? investor.teamMembers : [],
            });
            setShowAllTeamMembers(false);
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
                investmentStages: [],
                linkedinUrl: "",
                websiteUrl: "",
                notes: "",
                isActive: true,
                isVerified: false,
                type: "",
                serialNumber: "",
                source: "",
                tags: [],
                regionalFocus: [],
                teamMembers: [],
            });
            setShowAllTeamMembers(false);
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
                investmentStage: formData.investmentStages.length > 0
                    ? formData.investmentStages
                    : formData.investmentStage ? [formData.investmentStage] : [],
            };

            // Remove temporary fields
            delete (payload as any).ticketSizeMin;
            delete (payload as any).ticketSizeMax;
            delete (payload as any).investmentStages;

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

    const visibleTeamMembers = showAllTeamMembers
        ? formData.teamMembers
        : formData.teamMembers.slice(0, 5);

    const formatStage = (stage: string) => {
        return stage
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {title}
                        {formData.type && (
                            <Badge variant="outline" className="ml-2 text-xs">
                                {formData.type}
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Add a new investor to the platform."
                            : mode === "edit"
                                ? "Update investor information."
                                : "View investor details."}
                        {formData.serialNumber && (
                            <span className="ml-2 text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                                #{formData.serialNumber}
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Basic Information
                        </h3>
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
                                    disabled={isReadOnly || mode === "edit"}
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
                                <Label htmlFor="type">Investor Type</Label>
                                {isReadOnly ? (
                                    <Input
                                        id="type"
                                        value={formData.type}
                                        disabled
                                    />
                                ) : (
                                    <Select
                                        value={formData.type}
                                        onValueChange={(val) => handleChange("type", val)}
                                        disabled={isReadOnly}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Institutional">Institutional</SelectItem>
                                            <SelectItem value="Angel">Angel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="source">Source</Label>
                                <Input
                                    id="source"
                                    value={formData.source}
                                    onChange={(e) => handleChange("source", e.target.value)}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Investment Details Section */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Investment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div className="space-y-2 md:col-span-2">
                                <Label>Investment Stages</Label>
                                {isReadOnly ? (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.investmentStages.length > 0 ? (
                                            formData.investmentStages.map((stage, idx) => (
                                                <Badge key={idx} variant="secondary" className="bg-[var(--admin-soft)] text-gray-700">
                                                    {formatStage(stage)}
                                                </Badge>
                                            ))
                                        ) : formData.investmentStage ? (
                                            <Badge variant="secondary" className="bg-[var(--admin-soft)] text-gray-700">
                                                {formatStage(formData.investmentStage)}
                                            </Badge>
                                        ) : (
                                            <span className="text-gray-400 text-sm">No stages specified</span>
                                        )}
                                    </div>
                                ) : (
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
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Regional Focus & Tags Section */}
                    {(formData.regionalFocus.length > 0 || formData.tags.length > 0 || mode !== "view") && (
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Focus & Tags
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Regional Focus</Label>
                                    {isReadOnly ? (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.regionalFocus.length > 0 ? (
                                                formData.regionalFocus.map((region, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-gray-600">
                                                        {region}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm">No regional focus specified</span>
                                            )}
                                        </div>
                                    ) : (
                                        <Input
                                            placeholder="Enter regions (comma separated)"
                                            value={formData.regionalFocus.join(", ")}
                                            onChange={(e) => handleChange("regionalFocus", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Tag className="h-3 w-3" />
                                        Tags
                                    </Label>
                                    {isReadOnly ? (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.length > 0 ? (
                                                formData.tags.map((tag, idx) => (
                                                    <Badge key={idx} className="bg-[var(--admin-mid)] text-gray-800">
                                                        {tag}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm">No tags</span>
                                            )}
                                        </div>
                                    ) : (
                                        <Input
                                            placeholder="Enter tags (comma separated)"
                                            value={formData.tags.join(", ")}
                                            onChange={(e) => handleChange("tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Links Section */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="linkedinUrl"
                                        value={formData.linkedinUrl}
                                        onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                                        disabled={isReadOnly}
                                        className="flex-1"
                                    />
                                    {isReadOnly && formData.linkedinUrl && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => window.open(formData.linkedinUrl, "_blank")}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="websiteUrl">Website URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={(e) => handleChange("websiteUrl", e.target.value)}
                                        disabled={isReadOnly}
                                        className="flex-1"
                                    />
                                    {isReadOnly && formData.websiteUrl && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => window.open(formData.websiteUrl, "_blank")}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold text-gray-700">Notes</h3>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleChange("notes", e.target.value)}
                            disabled={isReadOnly}
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Team Members Section */}
                    {formData.teamMembers.length > 0 && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Team Members ({formData.teamMembers.length})
                                </h3>
                                {formData.teamMembers.length > 5 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowAllTeamMembers(!showAllTeamMembers)}
                                        className="text-xs"
                                    >
                                        {showAllTeamMembers ? (
                                            <>
                                                Show Less <ChevronUp className="ml-1 h-3 w-3" />
                                            </>
                                        ) : (
                                            <>
                                                Show All ({formData.teamMembers.length}) <ChevronDown className="ml-1 h-3 w-3" />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                                {visibleTeamMembers.map((member, idx) => (
                                    <div
                                        key={member._id || idx}
                                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-[var(--admin-soft)] transition-colors"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-[var(--admin-soft)] flex items-center justify-center flex-shrink-0">
                                            <User className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm text-gray-900 truncate">
                                                    {member.name}
                                                </span>
                                                {member.role && (
                                                    <Badge variant="outline" className="text-xs flex-shrink-0">
                                                        {member.role}
                                                    </Badge>
                                                )}
                                            </div>
                                            {member.email && (
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-[var(--admin-mid)] mt-1"
                                                >
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate">{member.email}</span>
                                                </a>
                                            )}
                                            {member.linkedinUrl && (
                                                <a
                                                    href={member.linkedinUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 mt-1"
                                                >
                                                    <Linkedin className="h-3 w-3" />
                                                    <span>LinkedIn</span>
                                                    <ExternalLink className="h-2 w-2" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {!showAllTeamMembers && formData.teamMembers.length > 5 && (
                                <p className="text-xs text-gray-400 text-center">
                                    Showing 5 of {formData.teamMembers.length} team members
                                </p>
                            )}
                        </div>
                    )}

                    {/* Status Toggles */}
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

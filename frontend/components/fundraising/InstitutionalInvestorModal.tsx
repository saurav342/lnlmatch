import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Globe, Mail, ArrowLeft, Heart, Linkedin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface InstitutionalInvestorModalProps {
    isOpen: boolean;
    onClose: () => void;
    investor: any;
}

export function InstitutionalInvestorModal({
    isOpen,
    onClose,
    investor,
}: InstitutionalInvestorModalProps) {
    if (!investor) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                {/* Header Section */}
                <div className="p-6 pb-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="mb-4 h-8 gap-1 text-muted-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Discover
                    </Button>

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                            <Avatar className="h-16 w-16 border bg-muted">
                                <AvatarImage src={investor.avatar} alt={investor.name} />
                                <AvatarFallback className="text-xl">
                                    {investor.name?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-xl font-semibold">{investor.name}</h2>
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0">
                                        {investor.type || 'Institutional'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{investor.company}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                            <Heart className="h-4 w-4" />
                            Add to Wishlist
                        </Button>
                    </div>
                </div>

                <Separator />

                <div className="p-6 space-y-8">
                    {/* Investment Thesis */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2v20M2 12h20" />
                            </svg>
                            Investment Thesis:
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">
                            {investor.investmentThesis || investor.notes || "No investment thesis available."}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-semibold mb-2">Country</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-sm">{investor.country || 'India'}</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                Regional Focus:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {investor.regionalFocus?.length > 0 ? (
                                    investor.regionalFocus.map((region: string) => (
                                        <Badge key={region} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
                                            {region}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground">Global</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Contact Information:
                        </h4>
                        {investor.email ? (
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-emerald-600" />
                                <a href={`mailto:${investor.email}`} className="text-sm hover:underline">
                                    {investor.email}
                                </a>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Not available</p>
                        )}
                    </div>

                    {/* Industry Focus */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3">Industry Focus</h4>
                        <div className="flex flex-wrap gap-2">
                            {investor.industries?.map((industry: string) => (
                                <Badge key={industry} variant="secondary" className="bg-slate-800 text-white hover:bg-slate-700 border-0">
                                    {industry}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Team Members */}
                    {investor.teamMembers && investor.teamMembers.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold mb-3">Team Members</h4>
                            <div className="grid gap-3">
                                {investor.teamMembers.map((member: any, idx: number) => (
                                    <div key={idx} className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                                        <div className="flex gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback>{member.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{member.name}</p>
                                                <p className="text-xs text-muted-foreground">{member.role || 'Team Member'}</p>
                                            </div>
                                        </div>
                                        {member.linkedinUrl && (
                                            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" asChild>
                                                <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                                    <Linkedin className="h-3 w-3" />
                                                    LinkedIn
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Website Button */}
                    {investor.website && (
                        <div className="pt-2">
                            <Button variant="outline" className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50" asChild>
                                <a href={investor.website} target="_blank" rel="noopener noreferrer">
                                    <Globe className="h-4 w-4" />
                                    Visit website
                                </a>
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

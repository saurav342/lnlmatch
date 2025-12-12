"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Globe, Mail, X, Heart, Linkedin, Lock, Crown, Eye, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { viewContact, InvestorMeta } from "@/lib/api";

interface InvestorDetailSectionProps {
    investor: any;
    onClose: () => void;
    meta?: InvestorMeta | null;
}

export function InvestorDetailSection({
    investor,
    onClose,
    meta,
}: InvestorDetailSectionProps) {
    const [revealedContact, setRevealedContact] = useState<{
        email?: string;
        linkedinUrl?: string;
        teamMembers?: any[];
    } | null>(null);
    const [isRevealing, setIsRevealing] = useState(false);
    const [revealError, setRevealError] = useState<string | null>(null);
    const [contactsRemaining, setContactsRemaining] = useState<number | 'unlimited'>(
        meta?.counts.contactsRemaining || 'unlimited'
    );

    if (!investor) return null;

    const isPremium = meta?.isPremium ?? true;
    const contactRevealed = investor.contactRevealed || revealedContact !== null;
    const displayEmail = revealedContact?.email || investor.email;
    const displayLinkedin = revealedContact?.linkedinUrl || investor.linkedinUrl;
    const displayTeamMembers = revealedContact?.teamMembers || investor.teamMembers || [];

    const handleRevealContact = async () => {
        if (!investor.id) return;

        setIsRevealing(true);
        setRevealError(null);

        try {
            const response = await viewContact(investor.id);

            if (response.success) {
                setRevealedContact(response.contact);
                if (response.remaining !== undefined) {
                    setContactsRemaining(response.remaining);
                }
            } else {
                if (response.limitReached) {
                    setRevealError('You have reached your free plan limit. Upgrade to premium for unlimited access.');
                } else {
                    setRevealError(response.message || 'Failed to reveal contact');
                }
            }
        } catch (error) {
            console.error('Error revealing contact:', error);
            setRevealError('Failed to reveal contact information');
        } finally {
            setIsRevealing(false);
        }
    };

    return (
        <Card className="h-fit sticky top-6 overflow-hidden border-0 shadow-lg bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50">
            {/* Header Section */}
            <div className="p-6 pb-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Investor Details
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-muted-foreground hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-full"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-md bg-white dark:bg-slate-800">
                        <AvatarImage src={investor.avatar} alt={investor.name} />
                        <AvatarFallback className="text-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-semibold">
                            {investor.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h2 className="text-lg font-semibold truncate">{investor.name}</h2>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0 text-xs shrink-0">
                                {investor.type || 'Institutional'}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{investor.company}</p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full gap-2 text-emerald-600 border-emerald-200 bg-white/80 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800/50 dark:border-emerald-800 dark:hover:bg-emerald-950/50"
                >
                    <Heart className="h-4 w-4" />
                    Add to Wishlist
                </Button>
            </div>

            <Separator />

            <div className="p-6 space-y-6">
                {/* Investment Thesis */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <Plus className="h-3.5 w-3.5" />
                        Investment Thesis
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">
                        {investor.investmentThesis || investor.notes || "No investment thesis available."}
                    </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Country</h4>
                        <span className="text-sm font-medium">{investor.country || 'India'}</span>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5" />
                            Regional Focus
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {investor.regionalFocus?.length > 0 ? (
                                investor.regionalFocus.map((region: string) => (
                                    <Badge key={region} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 text-xs">
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
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        Contact Information
                        {!isPremium && contactsRemaining !== 'unlimited' && (
                            <span className="text-xs font-normal normal-case ml-1">
                                ({contactsRemaining} reveals remaining)
                            </span>
                        )}
                    </h4>

                    {contactRevealed ? (
                        displayEmail ? (
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900">
                                <Mail className="h-4 w-4 text-emerald-600" />
                                <a href={`mailto:${displayEmail}`} className="text-sm hover:underline text-emerald-700 dark:text-emerald-300 font-medium">
                                    {displayEmail}
                                </a>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No email available</p>
                        )
                    ) : (
                        <div className="space-y-3">
                            {revealError ? (
                                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-xs text-red-700 dark:text-red-300">{revealError}</p>
                                    <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700 text-xs h-8">
                                        <Crown className="h-3.5 w-3.5 mr-1.5" />
                                        Upgrade to Premium
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lock className="h-4 w-4 text-slate-500" />
                                        <div>
                                            <p className="text-xs font-medium">Contact info is hidden</p>
                                            <p className="text-xs text-muted-foreground">
                                                Use one of your {contactsRemaining} remaining reveals
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={handleRevealContact}
                                        disabled={isRevealing}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-xs h-8"
                                    >
                                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                                        {isRevealing ? 'Revealing...' : 'Reveal Contact Info'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Industry Focus */}
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Industry Focus</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {investor.industries?.map((industry: string) => (
                            <Badge key={industry} variant="secondary" className="bg-slate-800 text-white hover:bg-slate-700 border-0 text-xs">
                                {industry}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Team Members */}
                {displayTeamMembers && displayTeamMembers.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team Members</h4>
                        <div className="space-y-2">
                            {displayTeamMembers.map((member: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                                    <div className="flex gap-2 items-center">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs">{member.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.role || 'Team Member'}</p>
                                        </div>
                                    </div>
                                    {member.linkedinUrl && (
                                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                                <Linkedin className="h-4 w-4" />
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
                    <Button variant="outline" className="w-full gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50" asChild>
                        <a href={investor.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                            Visit website
                        </a>
                    </Button>
                )}
            </div>
        </Card>
    );
}

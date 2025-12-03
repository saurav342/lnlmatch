import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Globe, Mail, Calendar, DollarSign } from "lucide-react";

interface OpportunityDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    type: "investor" | "grant";
}

export function OpportunityDetailsModal({
    isOpen,
    onClose,
    data,
    type,
}: OpportunityDetailsModalProps) {
    if (!data) return null;

    const isInvestor = type === "investor";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[80vw] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-4">
                        {isInvestor && (
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={data.avatar} alt={data.name} />
                                <AvatarFallback>
                                    {data.name
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div>
                            <DialogTitle className="text-2xl">{data.name || data.title}</DialogTitle>
                            <DialogDescription className="text-base mt-1">
                                {isInvestor ? data.company : data.organization}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {isInvestor && (
                            <Badge variant="secondary" className="bg-emerald-900 text-white">
                                {data.type}
                            </Badge>
                        )}
                        {!isInvestor && (
                            <Badge variant={data.isEquityFree ? "default" : "secondary"}>
                                {data.isEquityFree ? "Equity-free" : "Equity"}
                            </Badge>
                        )}
                        {data.country && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {data.country}
                            </Badge>
                        )}
                        {data.location && (
                            <Badge variant="outline">
                                {data.location}
                            </Badge>
                        )}
                        {!isInvestor && data.deadline && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Deadline: {new Date(data.deadline).toLocaleDateString()}
                            </Badge>
                        )}
                        {!isInvestor && data.amount && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {data.amount.min} - {data.amount.max}
                            </Badge>
                        )}
                    </div>

                    {data.description && (
                        <div className="space-y-2">
                            <h4 className="font-semibold">Description</h4>
                            <p className="text-muted-foreground leading-relaxed">
                                {data.description}
                            </p>
                        </div>
                    )}

                    {isInvestor && data.investmentThesis && (
                        <div className="space-y-2">
                            <h4 className="font-semibold">Investment Thesis</h4>
                            <p className="text-muted-foreground leading-relaxed">
                                {data.investmentThesis}
                            </p>
                        </div>
                    )}

                    {isInvestor && data.regionalFocus && data.regionalFocus.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-semibold">Regional Focus</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.regionalFocus.map((region: string) => (
                                    <Badge key={region} variant="outline">
                                        {region}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {isInvestor && data.email && (
                        <div className="space-y-2">
                            <h4 className="font-semibold">Contact Information</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <a href={`mailto:${data.email}`} className="hover:underline">
                                    {data.email}
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <h4 className="font-semibold">{isInvestor ? "Industry Focus" : "Tags"}</h4>
                        <div className="flex flex-wrap gap-2">
                            {(isInvestor ? data.industries : data.tags)?.map((tag: string) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {isInvestor && data.ticketSize && (
                        <div className="space-y-2">
                            <h4 className="font-semibold">Ticket Size</h4>
                            <p className="text-sm text-muted-foreground">
                                {typeof data.ticketSize === 'object'
                                    ? `$${data.ticketSize.min?.toLocaleString() || '0'} - $${data.ticketSize.max?.toLocaleString() || '0'}`
                                    : data.ticketSize
                                }
                            </p>
                        </div>
                    )}

                    {isInvestor && data.teamMembers && data.teamMembers.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-semibold">Team Members</h4>
                            <div className="space-y-2">
                                {data.teamMembers.map((member: any, index: number) => (
                                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>
                                                {member.name
                                                    ?.split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-medium text-sm">{member.name}</p>
                                                {member.linkedinUrl && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-xs"
                                                        asChild
                                                    >
                                                        <a
                                                            href={member.linkedinUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            LinkedIn
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    <div className="flex gap-3 pt-4 border-t">
                        {data.website && (
                            <Button variant="outline" className="flex-1" asChild>
                                <a href={data.website} target="_blank" rel="noopener noreferrer">
                                    <Globe className="mr-2 h-4 w-4" />
                                    Visit Website
                                </a>
                            </Button>
                        )}
                        {data.email && (
                            <Button className="flex-1" asChild>
                                <a href={`mailto:${data.email}`}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Contact
                                </a>
                            </Button>
                        )}
                        {!isInvestor && (
                            <Button className="flex-1">
                                Apply Now
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

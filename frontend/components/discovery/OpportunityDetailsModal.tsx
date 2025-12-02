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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                        {data.location && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
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

                    <div className="space-y-2">
                        <h4 className="font-semibold">About</h4>
                        <p className="text-muted-foreground leading-relaxed">
                            {data.description || "No description available."}
                        </p>
                    </div>

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
                            <p className="text-sm text-muted-foreground">{data.ticketSize}</p>
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

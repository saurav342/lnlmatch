
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, ArrowRight, Building2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
    data: any;
    type: "investor" | "grant";
    onViewDetails: (data: any) => void;
    onToggleWishlist?: (id: string) => void;
}

export function OpportunityCard({ data, type, onViewDetails, onToggleWishlist }: OpportunityCardProps) {
    const isInvestor = type === "investor";

    return (
        <Card className="group flex flex-col h-full bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden relative border-border/60">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <CardHeader className="flex flex-row items-center gap-4 pb-4 relative z-10">
                {isInvestor && (
                    <Avatar className="h-14 w-14 border-2 border-background shadow-sm ring-1 ring-border/50">
                        <AvatarImage src={data.avatar} alt={data.name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold text-lg">
                            {data.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-lg leading-tight truncate pr-2 text-foreground group-hover:text-primary transition-colors">
                            {data.name || data.title}
                        </h3>
                        {/* Type Badge */}
                        <Badge variant="secondary" className={cn(
                            "text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 h-auto",
                            isInvestor ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        )}>
                            {isInvestor ? data.type : (data.isEquityFree ? "Equity-free" : "Equity")}
                        </Badge>
                    </div>
                    {isInvestor && data.location && (
                        <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3 shrink-0" />
                            <span className="truncate">{data.location}</span>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-5 relative z-10">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {data.description || "No description available for this opportunity."}
                </p>

                {!isInvestor && (
                    <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-lg w-fit">
                        <span className="text-xs font-semibold text-foreground">Grant Range:</span>
                        <Badge variant="outline" className="bg-background border-primary/20 text-primary">
                            {data.amount?.min ? `$${data.amount.min}` : 'N/A'} - {data.amount?.max ? `$${data.amount.max}` : 'N/A'}
                        </Badge>
                    </div>
                )}

                <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {isInvestor ? <Building2 className="h-3 w-3" /> : <Tag className="h-3 w-3" />}
                        {isInvestor ? "Industry Focus" : "Key Tags"}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {(isInvestor ? data.industries : data.tags)?.slice(0, 3).map((tag: string) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-secondary/60 hover:bg-secondary text-secondary-foreground font-medium px-2.5 py-0.5 transition-colors border-transparent hover:border-border/50"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {(isInvestor ? data.industries : data.tags)?.length > 3 && (
                            <Badge variant="outline" className="text-xs border-dashed text-muted-foreground bg-transparent">
                                +{(isInvestor ? data.industries : data.tags).length - 3}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2 pb-5 px-6 relative z-10 flex gap-3 mt-auto">
                <Button
                    variant="outline"
                    className={cn(
                        "flex-1 border-border/60 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/10 dark:hover:text-red-400 dark:hover:border-red-800 transition-all duration-200",
                        data.isWishlisted && "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist?.(data.id);
                    }}
                >
                    <Heart className={cn("h-4 w-4 mr-2", data.isWishlisted && "fill-current")} />
                    {data.isWishlisted ? "Saved" : "Save"}
                </Button>
                <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow group/btn"
                    onClick={() => onViewDetails(data)}
                >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Button>
            </CardFooter>
        </Card>
    );
}

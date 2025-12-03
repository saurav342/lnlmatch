import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, Eye } from "lucide-react";
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
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex gap-3">
                    {isInvestor && (
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={data.avatar} alt={data.name} />
                            <AvatarFallback>
                                {data.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <div className="space-y-1">
                        <h3 className="font-semibold leading-none tracking-tight">{data.name || data.title}</h3>
                        {isInvestor && (
                            <Badge variant="secondary" className="bg-emerald-900 text-white hover:bg-emerald-800">
                                {data.type}
                            </Badge>
                        )}
                        {!isInvestor && (
                            <Badge variant={data.isEquityFree ? "default" : "secondary"}>
                                {data.isEquityFree ? "Equity-free" : "Equity"}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {data.description || "No description available."}
                </p>

                {isInvestor && data.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {data.location}
                    </div>
                )}

                {!isInvestor && (
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                            {data.amount?.min ? `$${data.amount.min}` : 'N/A'} - {data.amount?.max ? `$${data.amount.max}` : 'N/A'}
                        </Badge>
                    </div>
                )}

                <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">
                        {isInvestor ? "Industry Focus:" : "Tags:"}
                    </span>
                    <div className="flex flex-wrap gap-1">
                        {(isInvestor ? data.industries : data.tags)?.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {(isInvestor ? data.industries : data.tags)?.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{(isInvestor ? data.industries : data.tags).length - 3}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
                <Button
                    variant="outline"
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                    onClick={() => onToggleWishlist?.(data.id)}
                >
                    <Heart className={cn("mr-2 h-4 w-4", data.isWishlisted && "fill-current")} />
                    {data.isWishlisted ? "Wishlisted" : "Wishlist"}
                </Button>
                <Button
                    variant="outline"
                    className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                    onClick={() => onViewDetails(data)}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
}

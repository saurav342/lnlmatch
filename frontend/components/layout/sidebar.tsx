"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVIGATION } from "@/lib/constants";

// Update NAVIGATION constant in lib/constants.ts instead of hardcoding here if possible, 
// but since I don't see that file, I will check if I need to update it there.
// Wait, the sidebar uses NAVIGATION from "@/lib/constants". I should check that file first.
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import {
    LayoutDashboard,
    Building2,
    Compass,
    Users,
    Award,
    Sparkles,
    Inbox,
    Mail,
    LineChart,
    CreditCard,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";

// Icon mapping
const iconMap: Record<string, any> = {
    LayoutDashboard,
    Building2,
    Compass,
    Users,
    Award,
    Sparkles,
    Inbox,
    Mail,
    LineChart,
    CreditCard,
    Settings: Settings, // Explicitly map Settings icon
};

export function Sidebar() {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpand = (name: string) => {
        setExpandedItems((prev) =>
            prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
        );
    };

    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <div className="hidden md:flex h-screen w-64 flex-col border-r border-border bg-card">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Logo />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {NAVIGATION.map((item) => {
                    const Icon = iconMap[item.icon];
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = expandedItems.includes(item.name);
                    const active = isActive(item.href);

                    return (
                        <div key={item.name}>
                            {hasChildren ? (
                                <>
                                    <button
                                        onClick={() => toggleExpand(item.name)}
                                        className={cn(
                                            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                            active && "bg-accent text-accent-foreground"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            <span>{item.name}</span>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </button>
                                    {isExpanded && item.children && (
                                        <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
                                            {item.children.map((child) => {
                                                const ChildIcon = iconMap[child.icon];
                                                return (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className={cn(
                                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                                            isActive(child.href) &&
                                                            "bg-accent text-accent-foreground"
                                                        )}
                                                    >
                                                        <ChildIcon className="h-4 w-4" />
                                                        <span>{child.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                        active && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="border-t border-border p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 px-2"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://avatar.vercel.sh/user.png" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-1 flex-col items-start text-left">
                                <span className="text-sm font-medium">John Doe</span>
                                <span className="text-xs text-muted-foreground">
                                    john@startup.com
                                </span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVIGATION } from "@/lib/constants";
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
    Bell,
    Sun,
    Moon,
    Menu,
    Search,
    Heart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchUserProfile } from "@/lib/api";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
    Settings,
    Heart,
};

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Fetch user profile on mount
    useEffect(() => {
        async function loadProfile() {
            try {
                const profile = await fetchUserProfile();
                setUserProfile(profile);
            } catch (error) {
                console.error("Failed to load profile", error);
            }
        }
        loadProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + "/");
    };

    const NavItem = ({ item, mobile = false }: { item: any; mobile?: boolean }) => {
        const Icon = iconMap[item.icon];
        const active = isActive(item.href);
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                "gap-2 h-9 px-4 rounded-full text-sm font-medium transition-all duration-200",
                                active
                                    ? "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                mobile && "w-full justify-start h-10 px-3"
                            )}
                        >
                            {!mobile && <Icon className="h-4 w-4 opacity-70" />}
                            <span>{item.name}</span>
                            <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="rounded-xl shadow-xl border-border/50 p-1">
                        {item.children.map((child: any) => {
                            const ChildIcon = iconMap[child.icon];
                            return (
                                <DropdownMenuItem key={child.name} asChild className="rounded-lg">
                                    <Link
                                        href={child.href}
                                        className={cn(
                                            "flex items-center gap-2 cursor-pointer",
                                            isActive(child.href) && "text-orange-600 bg-orange-50 dark:bg-orange-950/20"
                                        )}
                                    >
                                        <ChildIcon className="h-4 w-4" />
                                        <span>{child.name}</span>
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        return (
            <Link href={item.href}>
                <Button
                    variant="ghost"
                    className={cn(
                        "gap-2 h-9 px-4 rounded-full text-sm font-medium transition-all duration-200",
                        active
                            ? "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        mobile && "w-full justify-start h-10 px-3"
                    )}
                >
                    {!mobile && <Icon className="h-4 w-4 opacity-70" />}
                    <span>{item.name}</span>
                </Button>
            </Link>
        );
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-20 items-center px-4 md:px-8 gap-6">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight mr-4 hover:opacity-80 transition-opacity">
                    <Logo />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {NAVIGATION.map((item) => (
                        <NavItem key={item.name} item={item} />
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-orange-500/10 hover:text-orange-600 transition-colors">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl shadow-2xl border-border/50">
                                <div className="p-4 border-b border-border/50 bg-muted/30">
                                    <h4 className="font-semibold">Notifications</h4>
                                </div>
                                <div className="p-2">
                                    <DropdownMenuItem className="p-3 rounded-lg cursor-pointer">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium">New match found!</p>
                                            <p className="text-xs text-muted-foreground">
                                                2 investors match your profile
                                            </p>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="p-3 rounded-lg cursor-pointer">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium">Email opened</p>
                                            <p className="text-xs text-muted-foreground">
                                                John Smith opened your email
                                            </p>
                                        </div>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* User Profile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-1 p-0 overflow-hidden ring-2 ring-transparent hover:ring-orange-500/20 transition-all">
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src="https://avatar.vercel.sh/user.png" />
                                        <AvatarFallback className="bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600">
                                            {userProfile?.name?.substring(0, 2).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-2xl border-border/50">
                                <DropdownMenuLabel className="p-4 bg-muted/30 border-b border-border/50">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{userProfile?.name || 'User'}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {userProfile?.email || 'user@example.com'}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <div className="p-2">
                                    <DropdownMenuItem className="rounded-lg cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 rounded-full">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80 p-0">
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b border-border/50">
                                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl" onClick={() => setIsMobileOpen(false)}>
                                        <Logo />
                                    </Link>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="flex flex-col gap-1">
                                        {NAVIGATION.map((item) => (
                                            <div key={item.name} onClick={() => setIsMobileOpen(false)}>
                                                <NavItem item={item} mobile />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

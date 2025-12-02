"use client";

import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User, Settings, LogOut, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { fetchUserProfile } from "@/lib/api";

export function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);

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

    // Generate breadcrumbs from pathname
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => ({
        name: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: "/" + pathSegments.slice(0, index + 1).join("/"),
        isLast: index === pathSegments.length - 1,
    }));

    return (
        <header className="sticky top-0 z-40 border-b border-[var(--admin-neutral)]/20 bg-white/80 dark:bg-card/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-4 gap-4">
                {/* Breadcrumbs & Page Title */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={crumb.href} className="flex items-center gap-2">
                                {index > 0 && <span>/</span>}
                                <span
                                    className={crumb.isLast ? "text-foreground font-medium" : ""}
                                >
                                    {crumb.name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {breadcrumbs[breadcrumbs.length - 1]?.name || "Dashboard"}
                    </h1>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Global Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search users, investors..."
                            className="w-64 pl-10 h-10 bg-muted/40 border-transparent focus:bg-background focus:border-[var(--admin-accent)]"
                        />
                    </div>

                    {/* Quick Actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                className="gap-2 bg-gradient-to-r from-[var(--admin-mid)] to-[var(--admin-strong)] hover:from-[var(--admin-strong)] hover:to-[var(--admin-success)] text-gray-900 font-medium shadow-sm"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Quick Add</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>Add User</DropdownMenuItem>
                            <DropdownMenuItem>Add Investor</DropdownMenuItem>
                            <DropdownMenuItem>Import Data</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--admin-accent)] animate-pulse" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="p-2 space-y-2">
                                <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer">
                                    <p className="text-sm font-medium">5 new user signups</p>
                                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer">
                                    <p className="text-sm font-medium">Payment failed</p>
                                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-10 gap-2 pl-2 pr-3 rounded-full border border-[var(--admin-neutral)]/30 hover:border-[var(--admin-mid)]"
                            >
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src="https://avatar.vercel.sh/admin.png" />
                                    <AvatarFallback className="bg-gradient-to-br from-[var(--admin-highlight)] to-[var(--admin-mid)] text-gray-900 text-xs font-semibold">
                                        {userProfile?.name?.substring(0, 2).toUpperCase() || "AD"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden lg:flex flex-col items-start">
                                    <span className="text-sm font-medium">
                                        {userProfile?.name || "Admin"}
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="h-4 px-1.5 text-[10px] bg-[var(--admin-soft)]/30 text-foreground"
                                    >
                                        Admin
                                    </Badge>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">
                                        {userProfile?.name || "Admin"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {userProfile?.email || "admin@example.com"}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

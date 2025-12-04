"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import {
    LayoutDashboard,
    Users,
    Building2,
    CreditCard,
    Activity,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navigation = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Investors", href: "/admin/investors", icon: Building2 },
    { name: "Investor Processing", href: "/admin/investor-processing", icon: Users },
    { name: "Investor Processing V2", href: "/admin/investor-processing-v2", icon: Users },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { name: "Activity Log", href: "/admin/activity", icon: Activity },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [userRole, setUserRole] = useState<string>('admin');

    // Get user role from localStorage on mount
    useState(() => {
        if (typeof window !== 'undefined') {
            // Try to get user info from localStorage
            const token = localStorage.getItem('authToken');
            const userStr = localStorage.getItem('user');

            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setUserRole(user.userType || 'admin');
                } catch (e) {
                    console.error('Failed to parse user data', e);
                }
            }
        }
    });

    // Filter navigation items based on role
    const filteredNavigation = navigation.filter(item => {
        // Only show Activity Log to superadmin users
        if (item.name === 'Activity Log') {
            return userRole === 'superadmin';
        }
        return true;
    });

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={cn(
                "sticky top-0 h-screen border-r border-[var(--admin-neutral)]/20 bg-white dark:bg-card transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--admin-neutral)]/20">
                    {!collapsed && (
                        <Link href="/admin" className="flex items-center gap-2">
                            <Logo />
                        </Link>
                    )}
                    {collapsed && (
                        <Link href="/admin" className="flex justify-center w-full">
                            <Logo />
                        </Link>
                    )}
                </div>

                {/* Collapse Toggle */}
                <div className="px-4 py-2 border-b border-[var(--admin-neutral)]/20">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full hover:bg-[var(--admin-soft)]/20"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {filteredNavigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link key={item.name} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 h-11 transition-all duration-200",
                                        active
                                            ? "bg-gradient-to-r from-[var(--admin-highlight)] to-[var(--admin-mid)] text-gray-900 dark:text-white font-semibold shadow-sm"
                                            : "text-muted-foreground hover:bg-[var(--admin-soft)]/30 hover:text-foreground",
                                        collapsed && "justify-center"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", active && "opacity-100")} />
                                    {!collapsed && <span>{item.name}</span>}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--admin-neutral)]/20">
                    <div
                        className={cn(
                            "px-3 py-2 rounded-lg bg-gradient-to-br from-[var(--admin-soft)]/20 to-[var(--admin-highlight)]/20 border border-[var(--admin-mid)]/30",
                            collapsed && "px-2"
                        )}
                    >
                        {!collapsed ? (
                            <div className="text-xs text-muted-foreground">
                                <p className="font-semibold text-foreground mb-1">Admin Panel</p>
                                <p>Manage your platform</p>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <Settings className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}

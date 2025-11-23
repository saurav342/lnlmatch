"use client";

import { usePathname } from "next/navigation";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MobileSidebar } from "./mobile-sidebar";

export function Header() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    // Generate breadcrumbs from pathname
    const breadcrumbs = pathname
        .split("/")
        .filter(Boolean)
        .map((segment, index, arr) => {
            const href = "/" + arr.slice(0, index + 1).join("/");
            const label = segment
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            return { label, href };
        });

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <MobileSidebar />
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.href} className="flex items-center gap-2">
                        <span
                            className={
                                index === breadcrumbs.length - 1
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground"
                            }
                        >
                            {crumb.label}
                        </span>
                        {index < breadcrumbs.length - 1 && (
                            <span className="text-muted-foreground">/</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
                {/* Search */}
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-muted-foreground"
                >
                    <Search className="h-4 w-4" />
                    <span className="hidden md:inline">Search...</span>
                    <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:inline-flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <Badge
                                variant="destructive"
                                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                            >
                                3
                            </Badge>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <div className="p-2 text-sm font-medium">Notifications</div>
                        <DropdownMenuItem>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium">New match found!</p>
                                <p className="text-xs text-muted-foreground">
                                    2 investors match your profile
                                </p>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium">Email opened</p>
                                <p className="text-xs text-muted-foreground">
                                    John Smith opened your email
                                </p>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Toggle */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

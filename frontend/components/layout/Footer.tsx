import Link from "next/link";

export function Footer() {
    return (
        <footer className="relative border-t border-border/50 bg-gradient-to-b from-background to-background/95">
            {/* Subtle top glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    {/* Copyright */}
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">C</span>
                        </div>
                        <p className="text-sm font-medium text-foreground/80">
                            &copy; {new Date().getFullYear()} Capify. All rights reserved.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/terms"
                            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                        >
                            Terms of Service
                        </Link>
                        <span className="text-muted-foreground/30">•</span>
                        <Link
                            href="/privacy"
                            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

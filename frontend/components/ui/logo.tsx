import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-sm">
                <span className="text-lg font-bold leading-none tracking-tighter">iK</span>
            </div>
            {showText && (
                <span className="text-xl font-bold tracking-tight">iKomatch</span>
            )}
        </div>
    );
}

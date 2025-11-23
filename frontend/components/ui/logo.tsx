import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* Using the SVG logo which includes the text and gradient */}
            <img src="/logo.png" alt="Capify" className="h-8 w-auto" />
        </div>
    );
}

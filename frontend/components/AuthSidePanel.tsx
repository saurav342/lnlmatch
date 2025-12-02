"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function AuthSidePanel() {
    return (
        <div className="hidden lg:flex flex-col justify-between w-full h-full bg-[#1a103c] p-12 relative overflow-hidden text-white">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-8">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Trusted by 500+ founders</span>
                    </div>

                    <div className="mb-12">
                        <Logo className="h-10 w-auto text-white" />
                    </div>

                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Fund Your Startup <br />
                        <span className="text-primary">Journey with AI</span>
                    </h1>

                    <p className="text-lg text-gray-300 max-w-md leading-relaxed">
                        Connect with the perfect investors, discover non-dilutive grants, and accelerate your growth using our AI-powered matchmaking engine.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <div className="p-2 rounded-lg bg-white/10">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">AI Matchmaking</h3>
                            <p className="text-sm text-gray-400">Find investors who actually care about your startup</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <div className="p-2 rounded-lg bg-white/10">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Grant Discovery</h3>
                            <p className="text-sm text-gray-400">Access non-dilutive capital opportunities</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

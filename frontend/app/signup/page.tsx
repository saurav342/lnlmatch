"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { API_BASE_URL } from "@/lib/api";
import AuthSidePanel from "@/components/AuthSidePanel";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { cn } from "@/lib/utils";

const signupSchema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name must be less than 50 characters" })
        .regex(/^[a-zA-Z\s'-]+$/, { message: "Name can only contain letters, spaces, hyphens, and apostrophes" }),
    email: z.string()
        .email({ message: "Please enter a valid email address" })
        .min(5, { message: "Email is too short" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid, touchedFields, dirtyFields },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const passwordValue = watch("password");
    const confirmPasswordValue = watch("confirmPassword");
    const passwordsMatch = passwordValue && confirmPasswordValue && passwordValue === confirmPasswordValue;

    // Helper function to determine field validation state
    const getFieldState = (fieldName: keyof SignupFormValues) => {
        const hasError = errors[fieldName];
        const isTouched = touchedFields[fieldName];
        const isDirty = dirtyFields[fieldName];
        const isValidField = isDirty && !hasError;
        return { hasError, isTouched, isDirty, isValidField };
    };

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        setServerError("");

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                setSuccessMessage("Account created successfully! Redirecting to login...");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setServerError(responseData.message || "Failed to create account");
            }
        } catch (err) {
            setServerError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background">
            {/* Left Side Panel */}
            <div className="hidden lg:block w-1/2">
                <AuthSidePanel />
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
                        <p className="text-muted-foreground">Start your fundraising journey today</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {serverError && (
                            <Alert variant="destructive">
                                <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                        )}
                        {successMessage && (
                            <Alert className="border-green-500 text-green-500 bg-green-500/10">
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            {/* Full Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className={cn(
                                            "h-11 bg-background border-input pr-10",
                                            errors.name && "border-destructive focus:border-destructive",
                                            getFieldState("name").isValidField && "border-green-500 focus:border-green-500"
                                        )}
                                        {...register("name")}
                                    />
                                    {getFieldState("name").isValidField && (
                                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                    )}
                                </div>
                                {errors.name && (
                                    <p className="text-sm text-destructive font-medium flex items-center gap-1">
                                        <X className="h-3.5 w-3.5" />
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className={cn(
                                            "h-11 bg-background border-input pr-10",
                                            errors.email && "border-destructive focus:border-destructive",
                                            getFieldState("email").isValidField && "border-green-500 focus:border-green-500"
                                        )}
                                        {...register("email")}
                                    />
                                    {getFieldState("email").isValidField && (
                                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                    )}
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive font-medium flex items-center gap-1">
                                        <X className="h-3.5 w-3.5" />
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        className={cn(
                                            "h-11 bg-background border-input pr-10",
                                            errors.password && "border-destructive focus:border-destructive",
                                            getFieldState("password").isValidField && "border-green-500 focus:border-green-500"
                                        )}
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {/* Password Strength Indicator */}
                                <PasswordStrengthIndicator password={passwordValue || ""} />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-enter password"
                                        className={cn(
                                            "h-11 bg-background border-input pr-10",
                                            errors.confirmPassword && "border-destructive focus:border-destructive",
                                            passwordsMatch && "border-green-500 focus:border-green-500"
                                        )}
                                        {...register("confirmPassword")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {/* Password Match Indicator */}
                                {confirmPasswordValue && (
                                    <p className={cn(
                                        "text-sm font-medium flex items-center gap-1",
                                        passwordsMatch ? "text-green-500" : "text-destructive"
                                    )}>
                                        {passwordsMatch ? (
                                            <>
                                                <Check className="h-3.5 w-3.5" />
                                                Passwords match
                                            </>
                                        ) : (
                                            <>
                                                <X className="h-3.5 w-3.5" />
                                                Passwords do not match
                                            </>
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className={cn(
                                "w-full h-11 font-semibold transition-all",
                                isValid
                                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                                    : "bg-orange-500/50 text-white/70 cursor-not-allowed"
                            )}
                            disabled={isLoading || !isValid}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link href="/login">
                            <Button variant="outline" className="w-full h-11">
                                Sign in
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

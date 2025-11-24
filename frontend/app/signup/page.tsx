"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { API_BASE_URL } from "@/lib/api";

const signupSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
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
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

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
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10 px-4"
            >
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-block mb-4">
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-xl">C</span>
                            </div>
                            <span className="text-2xl font-bold text-foreground">
                                Capify
                            </span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Create an account</h1>
                    <p className="text-muted-foreground">Start your fundraising journey today</p>
                </div>

                <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-foreground">Sign Up</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Enter your details to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className={`bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${errors.name ? "border-destructive focus:border-destructive" : ""}`}
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive font-medium">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-foreground">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className={`bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${errors.email ? "border-destructive focus:border-destructive" : ""}`}
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive font-medium">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-foreground">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={`bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 pr-10 ${errors.password ? "border-destructive focus:border-destructive" : ""}`}
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className={`bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 ${errors.confirmPassword ? "border-destructive focus:border-destructive" : ""}`}
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive font-medium">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
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
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-border pt-6">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}

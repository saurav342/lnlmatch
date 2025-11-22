"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { overviewSchema, type OverviewFormData } from "@/lib/validations";
import { INDUSTRIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

export function OverviewTab() {
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

    const form = useForm<OverviewFormData>({
        resolver: zodResolver(overviewSchema),
        defaultValues: {
            name: "",
            website: "",
            description: "",
            industry: [],
        },
    });

    const onSubmit = (data: OverviewFormData) => {
        console.log(data);
        // TODO: Save to backend/state
    };

    const toggleIndustry = (industry: string) => {
        const newSelection = selectedIndustries.includes(industry)
            ? selectedIndustries.filter((i) => i !== industry)
            : [...selectedIndustries, industry];

        setSelectedIndustries(newSelection);
        form.setValue("industry", newSelection);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Company Overview</h3>
                    <p className="text-sm text-muted-foreground">
                        Tell us about your startup. This information will be visible to investors.
                    </p>
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Acme Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="https://acme.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Your company website or landing page
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe your startup, your mission, and what makes you unique..."
                                    className="min-h-32 resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Minimum 50 characters ({field.value?.length || 0}/50)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="industry"
                    render={() => (
                        <FormItem>
                            <FormLabel>Industries</FormLabel>
                            <FormDescription>
                                Select all industries that apply to your startup
                            </FormDescription>
                            <div className="mt-3 space-y-3">
                                {/* Selected Industries */}
                                {selectedIndustries.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedIndustries.map((industry) => (
                                            <Badge
                                                key={industry}
                                                variant="default"
                                                className="gap-1"
                                            >
                                                {industry}
                                                <X
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() => toggleIndustry(industry)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Industry Grid */}
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {INDUSTRIES.map((industry) => (
                                        <Button
                                            key={industry}
                                            type="button"
                                            variant={
                                                selectedIndustries.includes(industry)
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() => toggleIndustry(industry)}
                                            className="justify-start"
                                        >
                                            {industry}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit">Save Overview</Button>
                </div>
            </form>
        </Form>
    );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { detailsSchema, type DetailsFormData } from "@/lib/validations";
import { STARTUP_STAGES, DIVERSITY_TAGS } from "@/lib/constants";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function DetailsTab() {
    const form = useForm<DetailsFormData>({
        resolver: zodResolver(detailsSchema),
        defaultValues: {
            stage: "MVP",
            fundingAmount: undefined,
            marketSize: "",
            diversityTags: [],
        },
    });

    const onSubmit = (data: DetailsFormData) => {
        console.log(data);
        // TODO: Save to backend/state
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Startup Details</h3>
                    <p className="text-sm text-muted-foreground">
                        Provide additional details about your startup stage and funding.
                    </p>
                </div>

                <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Stage</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your current stage" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {STARTUP_STAGES.map((stage) => (
                                        <SelectItem key={stage} value={stage}>
                                            {stage}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Where is your startup in its journey?
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fundingAmount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Funding Raised (USD)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="250000"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                                    }
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            <FormDescription>
                                Total funding raised to date (optional)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="marketSize"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Total Addressable Market</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., $5B global market" {...field} />
                            </FormControl>
                            <FormDescription>
                                Describe your market opportunity (optional)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="diversityTags"
                    render={() => (
                        <FormItem>
                            <FormLabel>Diversity & Inclusion</FormLabel>
                            <FormDescription>
                                Highlight diversity in your founding team (optional)
                            </FormDescription>
                            <div className="mt-3 space-y-3">
                                {DIVERSITY_TAGS.map((tag) => (
                                    <FormField
                                        key={tag}
                                        control={form.control}
                                        name="diversityTags"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={tag}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(tag)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...(field.value || []), tag])
                                                                    : field.onChange(
                                                                        field.value?.filter((value) => value !== tag)
                                                                    );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">{tag}</FormLabel>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit">Save Details</Button>
                </div>
            </form>
        </Form>
    );
}

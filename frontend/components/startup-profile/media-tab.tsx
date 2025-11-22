"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { mediaSchema, type MediaFormData } from "@/lib/validations";
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
import { Upload, FileText, X } from "lucide-react";
import { useState } from "react";

export function MediaTab() {
    const [file, setFile] = useState<File | null>(null);

    const form = useForm<MediaFormData>({
        resolver: zodResolver(mediaSchema),
        defaultValues: {
            pitchDeckUrl: "",
        },
    });

    const onSubmit = (data: MediaFormData) => {
        console.log(data);
        // TODO: Upload file and save URL
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            // In a real app, upload the file and get back a URL
            form.setValue("pitchDeckUrl", "https://example.com/pitch-deck.pdf");
        }
    };

    const clearFile = () => {
        setFile(null);
        form.setValue("pitchDeckUrl", "");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Media & Documents</h3>
                    <p className="text-sm text-muted-foreground">
                        Upload your pitch deck and other relevant materials.
                    </p>
                </div>

                <FormField
                    control={form.control}
                    name="pitchDeckUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pitch Deck</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    {/* Upload Zone */}
                                    {!file && (
                                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-12 transition-colors hover:bg-muted/40">
                                            <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                                            <p className="mb-2 text-sm font-medium">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PDF, PPT, or PPTX (MAX. 10MB)
                                            </p>
                                            <Input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.ppt,.pptx"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    )}

                                    {/* File Preview */}
                                    {file && (
                                        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={clearFile}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription>
                                Upload your pitch deck to share with investors
                            </FormDescription>
                            <FormMessage />
                            <Input type="hidden" {...field} />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit" disabled={!file}>
                        Save Media
                    </Button>
                </div>
            </form>
        </Form>
    );
}

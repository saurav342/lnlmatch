"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, RefreshCw, Wand2, Bold, Italic, Underline, Link, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Image, Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComposeEmailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recipientEmail?: string; // Optional, can be pre-filled
}

export function ComposeEmailModal({ open, onOpenChange, recipientEmail }: ComposeEmailModalProps) {
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);

    const handleGenerateContent = () => {
        setIsGenerating(true);
        // Mock API call
        setTimeout(() => {
            setGeneratedContent("Dear Investor,\n\nWe are excited to share our latest progress...");
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl h-[80vh] p-0 gap-0 overflow-hidden flex flex-col md:flex-row">
                {/* Left Side: Email Composer */}
                <div className="flex-1 flex flex-col h-full border-r">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle className="flex items-center gap-2">
                            <span className="text-xl">Compose Email to Investor</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
                        <div className="space-y-2">
                            <Label className="font-semibold">From</Label>
                            <Input value="starelectric.ev@gmail.com" readOnly className="bg-muted/50" />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-semibold">To</Label>
                            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] bg-white">
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 gap-1 rounded-full px-3 py-1">
                                    Primary Email: abhishek.agarwal@appreciate.capital
                                </Badge>
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 gap-1 rounded-full px-3 py-1">
                                    Sairee Chahal (FOUNDING PARTNER): sairee@appreciate.capital
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-emerald-600 cursor-pointer hover:underline">
                                    Click on any email to remove it from recipients
                                </span>
                                <span className="text-yellow-600 flex items-center gap-1">
                                    ⚠️ This will use 2 email credits
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-semibold">Subject</Label>
                            <Input
                                placeholder="Enter email subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col">
                            <Label className="font-semibold">Content</Label>
                            <div className="border rounded-md flex-1 flex flex-col">
                                {/* Toolbar */}
                                <div className="border-b p-2 flex items-center gap-1 bg-muted/20">
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Underline className="h-4 w-4" /></Button>
                                    <div className="w-px h-4 bg-border mx-1" />
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Type className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Link className="h-4 w-4" /></Button>
                                    <div className="w-px h-4 bg-border mx-1" />
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><List className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><ListOrdered className="h-4 w-4" /></Button>
                                    <div className="w-px h-4 bg-border mx-1" />
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><AlignLeft className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><AlignCenter className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><AlignRight className="h-4 w-4" /></Button>
                                    <div className="w-px h-4 bg-border mx-1" />
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Image className="h-4 w-4" /></Button>
                                </div>
                                <Textarea
                                    className="resize-none flex-1 border-0 focus-visible:ring-0 p-4"
                                    placeholder="Compose your email here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: AI Assistant */}
                <div className="w-[350px] bg-muted/10 flex flex-col border-l">
                    <div className="p-4 border-b flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2">
                            <Wand2 className="h-4 w-4 text-emerald-600" />
                            <span className="font-semibold">AI Content Generator</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border p-4 space-y-4 shadow-sm">
                                <div className="flex items-center justify-between text-sm">
                                    <Label>Generate up to 6 styles</Label>
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">0/6</Badge>
                                </div>

                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                    onClick={handleGenerateContent}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                    Generate Content
                                </Button>

                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-emerald-600">Next Style: Friendly and Relatable</p>
                                    {generatedContent ? (
                                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                                            {generatedContent}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic text-center py-4">
                                            No content generated yet
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-semibold text-sm">
                                        <span>⬇ Saved Drafts</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <RefreshCw className="h-3 w-3" />
                                    </Button>
                                </div>

                                <div className="text-center py-8 text-sm text-muted-foreground">
                                    No saved drafts
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

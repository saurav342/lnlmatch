"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { teamSchema, type TeamFormData, founderSchema, type FounderFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Mail, Linkedin, Trash2 } from "lucide-react";
import { useState } from "react";

export function TeamTab() {
    const [founders, setFounders] = useState<FounderFormData[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<TeamFormData>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            founders: [],
        },
    });

    const founderForm = useForm<FounderFormData>({
        resolver: zodResolver(founderSchema),
        defaultValues: {
            id: "",
            name: "",
            role: "",
            email: "",
            linkedin: "",
            avatar: "",
        },
    });

    const onSubmit = (data: TeamFormData) => {
        console.log(data);
        // TODO: Save to backend/state
    };

    const addFounder = (data: FounderFormData) => {
        const newFounder = {
            ...data,
            id: crypto.randomUUID(),
        };
        const updatedFounders = [...founders, newFounder];
        setFounders(updatedFounders);
        form.setValue("founders", updatedFounders);
        founderForm.reset();
        setDialogOpen(false);
    };

    const removeFounder = (id: string) => {
        const updatedFounders = founders.filter((f) => f.id !== id);
        setFounders(updatedFounders);
        form.setValue("founders", updatedFounders);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Founding Team</h3>
                            <p className="text-sm text-muted-foreground">
                                Add your founding team members
                            </p>
                        </div>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Founder
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Founder</DialogTitle>
                                    <DialogDescription>
                                        Add a new founding team member to your profile.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <FormLabel>Name</FormLabel>
                                        <Input
                                            placeholder="John Doe"
                                            {...founderForm.register("name")}
                                        />
                                        {founderForm.formState.errors.name && (
                                            <p className="text-sm text-destructive">
                                                {founderForm.formState.errors.name.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <FormLabel>Role</FormLabel>
                                        <Input
                                            placeholder="CEO & Co-Founder"
                                            {...founderForm.register("role")}
                                        />
                                        {founderForm.formState.errors.role && (
                                            <p className="text-sm text-destructive">
                                                {founderForm.formState.errors.role.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <FormLabel>Email (optional)</FormLabel>
                                        <Input
                                            type="email"
                                            placeholder="john@startup.com"
                                            {...founderForm.register("email")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FormLabel>LinkedIn (optional)</FormLabel>
                                        <Input
                                            type="url"
                                            placeholder="https://linkedin.com/in/johndoe"
                                            {...founderForm.register("linkedin")}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={founderForm.handleSubmit(addFounder)}
                                    >
                                        Add Founder
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Founders Grid */}
                {founders.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Plus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="mb-2 font-medium">No founders added yet</p>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Add your founding team to complete your profile
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {founders.map((founder) => (
                            <Card key={founder.id} className="p-4">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {getInitials(founder.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-medium">{founder.name}</h4>
                                        <p className="text-sm text-muted-foreground">{founder.role}</p>
                                        {founder.email && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                <span className="truncate">{founder.email}</span>
                                            </div>
                                        )}
                                        {founder.linkedin && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Linkedin className="h-3 w-3" />
                                                <span className="truncate">LinkedIn</span>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFounder(founder.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={founders.length === 0}>
                        Save Team
                    </Button>
                </div>
            </form>
        </Form>
    );
}

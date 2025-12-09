"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AngelInvestorsTab } from "@/components/fundraising/AngelInvestorsTab";
import { InstitutionalInvestorsTab } from "@/components/fundraising/InstitutionalInvestorsTab";


export default function FundraisingPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Fundraising</h1>
                    <p className="text-muted-foreground">
                        Discover funding opportunities for your startup
                    </p>
                </div>

                <Tabs defaultValue="angels" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="angels">Angel Investors</TabsTrigger>
                        <TabsTrigger value="institutional">Institutional Investors</TabsTrigger>
                    </TabsList>
                    <TabsContent value="angels" className="mt-6">
                        <AngelInvestorsTab />
                    </TabsContent>
                    <TabsContent value="institutional" className="mt-6">
                        <InstitutionalInvestorsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

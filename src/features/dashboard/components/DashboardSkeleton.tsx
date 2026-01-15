// Imports for UI components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-8 space-y-8">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 bg-slate-800" />
                    <Skeleton className="h-4 w-64 bg-slate-800/50" />
                </div>
                <Skeleton className="h-9 w-40 rounded-full bg-slate-800" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Revenue Chart Skeleton */}
                <Card className="col-span-12 md:col-span-8 bg-slate-900/50 border-white/5">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40 bg-slate-800" />
                                <Skeleton className="h-4 w-24 bg-slate-800/50" />
                            </div>
                            <Skeleton className="h-10 w-10 rounded-lg bg-slate-800" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[250px] w-full rounded-xl bg-slate-800/50" />
                    </CardContent>
                </Card>

                {/* Right Column Stack */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
                    {/* Highlight Card */}
                    <Skeleton className="h-[160px] w-full rounded-xl bg-slate-800/80" />

                    {/* Mini Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-[140px] rounded-xl bg-slate-800/50" />
                        <Skeleton className="h-[140px] rounded-xl bg-slate-800/50" />
                    </div>
                </div>

                {/* Bottom Row - Clients & Site */}
                <Card className="col-span-12 md:col-span-8 bg-slate-900/50 border-white/5">
                    <CardHeader>
                        <Skeleton className="h-6 w-48 bg-slate-800" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Skeleton className="h-[180px] w-full rounded-xl bg-slate-800/30" />
                        <Skeleton className="h-[180px] w-[180px] rounded-full bg-slate-800/30 mx-auto" />
                    </CardContent>
                </Card>

                <Skeleton className="col-span-12 md:col-span-4 h-[300px] rounded-xl bg-slate-800/50" />
            </div>
        </div>
    );
}



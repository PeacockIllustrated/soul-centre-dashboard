import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Sparkles, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function DashboardPage() {
    const supabase = createClient();
    const now = new Date().toISOString();

    // Fetch Stats
    const [
        { count: clientCount },
        { count: activeServicesCount },
        { data: upcomingSessions },
        { data: upcomingEvents }
    ] = await Promise.all([
        supabase.from("clients").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("services").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase
            .from("sessions")
            .select("*, clients(first_name, last_name), services(name)")
            .gte("start_time", now)
            .order("start_time", { ascending: true })
            .limit(5),
        supabase
            .from("event_instances")
            .select("*")
            .gte("start_time", now)
            .order("start_time", { ascending: true })
            .limit(5)
    ]);

    // Combine and sort upcoming items
    const combinedUpcoming = [
        ...(upcomingSessions || []).map(s => ({
            id: s.id,
            title: `${s.clients?.first_name} ${s.clients?.last_name} - ${s.services?.name}`,
            start_time: s.start_time,
            type: 'session',
            link: `/app/sessions/${s.id}`
        })),
        ...(upcomingEvents || []).map(e => ({
            id: e.id,
            title: e.title,
            start_time: e.start_time,
            type: 'event',
            link: `/app/events/${e.id}`
        }))
    ].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        .slice(0, 5); // Take top 5 after merging

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back, Kayleigh</h1>
                <p className="text-gray-500 mt-2">Here&apos;s what&apos;s happening at The Soul Centre today.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{clientCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Active profiles</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingSessions?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Next 7 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeServicesCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Offerings available</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Up Next</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {combinedUpcoming.length === 0 ? (
                                <p className="text-sm text-gray-500">No upcoming sessions or events scheduled.</p>
                            ) : (
                                combinedUpcoming.map((item) => (
                                    <Link
                                        key={`${item.type}-${item.id}`}
                                        href={item.link}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-2 rounded-full ${item.type === 'session' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {item.type === 'session' ? <Users className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none">{item.title}</p>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {format(new Date(item.start_time), "MMM d, h:mm a")}
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/app/sessions/new">
                            <Button className="w-full justify-start" variant="outline">
                                <Calendar className="mr-2 h-4 w-4" />
                                Book Session
                            </Button>
                        </Link>
                        <Link href="/app/clients/new">
                            <Button className="w-full justify-start" variant="outline">
                                <Users className="mr-2 h-4 w-4" />
                                Add Client
                            </Button>
                        </Link>
                        <Link href="/app/services/new">
                            <Button className="w-full justify-start" variant="outline">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Create Service
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

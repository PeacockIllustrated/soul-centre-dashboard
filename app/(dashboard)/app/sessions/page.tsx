import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Plus, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export default async function SessionsPage() {
    const supabase = createClient();

    // Fetch sessions with related client and service data
    const { data: sessions } = await supabase
        .from("sessions")
        .select(`
      *,
      clients (first_name, last_name),
      services (name)
    `)
        .order("start_time", { ascending: true });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Sessions</h1>
                <Link href="/app/sessions/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Session
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sessions?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                    No upcoming sessions.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sessions?.map((session: any) => (
                                <TableRow key={session.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{format(new Date(session.start_time), "MMM d, yyyy")}</span>
                                            <span className="text-xs text-gray-500">
                                                {format(new Date(session.start_time), "h:mm a")} - {format(new Date(session.end_time), "h:mm a")}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {session.clients?.first_name} {session.clients?.last_name}
                                    </TableCell>
                                    <TableCell>{session.services?.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-gray-500">
                                            <MapPin className="mr-1 h-3 w-3" />
                                            {session.location || "Online"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${session.status === "booked"
                                                    ? "bg-blue-50 text-blue-700"
                                                    : session.status === "completed"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {session.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/app/sessions/${session.id}`}>
                                            <Button variant="ghost" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

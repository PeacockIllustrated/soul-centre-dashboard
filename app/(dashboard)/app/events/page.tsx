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
import { Plus, MapPin, Users } from "lucide-react";
import { EventsNav } from "./nav";
import { format } from "date-fns";

export default async function EventsPage() {
    const supabase = createClient();
    const { data: events } = await supabase
        .from("event_instances")
        .select("*")
        .order("start_time", { ascending: true });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
                <Link href="/app/events/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Schedule Event
                    </Button>
                </Link>
            </div>

            <EventsNav />

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                    No upcoming events scheduled.
                                </TableCell>
                            </TableRow>
                        ) : (
                            events?.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{format(new Date(event.start_time), "MMM d, yyyy")}</span>
                                            <span className="text-xs text-gray-500">
                                                {format(new Date(event.start_time), "h:mm a")}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <Link href={`/app/events/${event.id}`} className="hover:underline">
                                            {event.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-gray-500">
                                            <MapPin className="mr-1 h-3 w-3" />
                                            {event.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-gray-500">
                                            <Users className="mr-1 h-3 w-3" />
                                            {event.capacity}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${event.status === "scheduled"
                                                    ? "bg-blue-50 text-blue-700"
                                                    : event.status === "completed"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {event.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/app/events/${event.id}`}>
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

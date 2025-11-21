import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Users, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { AttendeeList } from "./attendee-list";

export default async function EventDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = createClient();

    const [eventResult, attendeesResult] = await Promise.all([
        supabase.from("event_instances").select("*").eq("id", params.id).single(),
        supabase
            .from("event_attendees")
            .select("*, clients(first_name, last_name)")
            .eq("event_instance_id", params.id)
            .order("created_at", { ascending: true }),
    ]);

    const event = eventResult.data;
    const attendees = attendeesResult.data || [];

    if (!event) {
        notFound();
    }

    const bookedCount = attendees.filter(a => a.status !== 'cancelled').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/app/events">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {event.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                            {format(new Date(event.start_time), "MMMM d, yyyy")}
                        </div>
                        <div className="flex items-center">
                            <Clock className="mr-1.5 h-3.5 w-3.5" />
                            {format(new Date(event.start_time), "h:mm a")} - {format(new Date(event.end_time), "h:mm a")}
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">Edit Event</Button>
                    <Link href={`/app/events/${event.id}/add`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Attendee
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                                Event Details
                            </h3>
                            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{event.description || "-"}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                        <MapPin className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                                        {event.location}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                                    <dd className="mt-1 text-sm text-gray-900">£{event.price}</dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attendees List */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Attendees</h3>
                        <AttendeeList attendees={attendees} eventId={event.id} />
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                                Capacity
                            </h3>
                            <dl className="mt-5 grid grid-cols-1 gap-5">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Total Spots</dt>
                                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{event.capacity}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Booked</dt>
                                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{bookedCount}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Available</dt>
                                    <dd className={`mt-1 text-2xl font-semibold ${event.capacity - bookedCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {Math.max(0, event.capacity - bookedCount)}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

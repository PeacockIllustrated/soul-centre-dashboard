import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    startOfWeek,
    endOfWeek,
    format,
    addWeeks,
    subWeeks,
    eachDayOfInterval,
    isSameDay,
    parseISO
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default async function CalendarPage({
    searchParams,
}: {
    searchParams: { date?: string };
}) {
    const supabase = createClient();

    // Determine current week
    const today = new Date();
    const selectedDate = searchParams.date ? parseISO(searchParams.date) : today;
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

    // Fetch Sessions
    const { data: sessions } = await supabase
        .from("sessions")
        .select("*, clients(first_name, last_name), services(name)")
        .gte("start_time", weekStart.toISOString())
        .lte("start_time", weekEnd.toISOString());

    // Fetch Events
    const { data: events } = await supabase
        .from("event_instances")
        .select("*")
        .gte("start_time", weekStart.toISOString())
        .lte("start_time", weekEnd.toISOString());

    // Combine and normalize
    const allItems = [
        ...(sessions || []).map(s => ({
            id: s.id,
            title: `${s.clients?.first_name} ${s.clients?.last_name} - ${s.services?.name}`,
            start: new Date(s.start_time),
            end: new Date(s.end_time),
            type: 'session',
            status: s.status
        })),
        ...(events || []).map(e => ({
            id: e.id,
            title: e.title,
            start: new Date(e.start_time),
            end: new Date(e.end_time),
            type: 'event',
            status: e.status
        }))
    ];

    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const prevWeek = format(subWeeks(selectedDate, 1), "yyyy-MM-dd");
    const nextWeek = format(addWeeks(selectedDate, 1), "yyyy-MM-dd");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
                <div className="flex space-x-2">
                    <Link href="/app/sessions/new">
                        <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Session
                        </Button>
                    </Link>
                    <Link href="/app/events/new">
                        <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Event
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center space-x-4">
                    <Link href={`/app/calendar?date=${prevWeek}`}>
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-lg font-medium">
                        {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                    </h2>
                    <Link href={`/app/calendar?date=${nextWeek}`}>
                        <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
                <Link href="/app/calendar">
                    <Button variant="ghost" size="sm">Today</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {days.map((day) => {
                    const dayItems = allItems
                        .filter(item => isSameDay(item.start, day))
                        .sort((a, b) => a.start.getTime() - b.start.getTime());

                    const isToday = isSameDay(day, today);

                    return (
                        <div key={day.toString()} className={`flex flex-col space-y-2 ${isToday ? 'bg-indigo-50/50 rounded-lg -m-2 p-2' : ''}`}>
                            <div className={`text-center pb-2 border-b border-gray-100 ${isToday ? 'text-indigo-700 font-bold' : 'text-gray-500'}`}>
                                <div className="text-xs uppercase">{format(day, "EEE")}</div>
                                <div className="text-lg">{format(day, "d")}</div>
                            </div>

                            <div className="space-y-2 min-h-[100px]">
                                {dayItems.length === 0 ? (
                                    <div className="text-xs text-gray-300 text-center py-4">No items</div>
                                ) : (
                                    dayItems.map(item => (
                                        <Link
                                            key={item.id}
                                            href={item.type === 'session' ? `/app/sessions/${item.id}` : `/app/events/${item.id}`}
                                            className={`block p-2 rounded text-xs border shadow-sm hover:shadow-md transition-shadow ${item.type === 'session'
                                                    ? 'bg-white border-l-4 border-l-indigo-400'
                                                    : 'bg-white border-l-4 border-l-emerald-400'
                                                }`}
                                        >
                                            <div className="font-semibold truncate">{format(item.start, "h:mm a")}</div>
                                            <div className="truncate" title={item.title}>{item.title}</div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

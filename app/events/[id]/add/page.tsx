import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addAttendee } from "../../actions";
import Link from "next/link";

export default async function AddAttendeePage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = createClient();

    const [eventResult, clientsResult] = await Promise.all([
        supabase.from("event_instances").select("*").eq("id", params.id).single(),
        supabase.from("clients").select("id, first_name, last_name").eq("is_active", true).order("last_name"),
    ]);

    const event = eventResult.data;
    const clients = clientsResult.data || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Add Attendee</h1>
                <p className="text-sm text-gray-500">
                    Add a client to {event?.title}.
                </p>
            </div>

            <form action={addAttendee} className="space-y-8 max-w-2xl">
                <input type="hidden" name="event_instance_id" value={params.id} />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="client_id" className="text-sm font-medium leading-none">
                            Client
                        </label>
                        <select
                            id="client_id"
                            name="client_id"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">Select a client...</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.first_name} {client.last_name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500">
                            Can't find the client? <Link href="/app/clients/new" className="text-indigo-600 hover:underline">Create new client</Link>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="status" className="text-sm font-medium leading-none">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                defaultValue="booked"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="booked">Booked</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="attended">Attended</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="payment_status" className="text-sm font-medium leading-none">
                                Payment Status
                            </label>
                            <select
                                id="payment_status"
                                name="payment_status"
                                defaultValue="unpaid"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                                <option value="comped">Comped</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="amount_paid" className="text-sm font-medium leading-none">
                            Amount Paid (£)
                        </label>
                        <Input
                            id="amount_paid"
                            name="amount_paid"
                            type="number"
                            step="0.01"
                            defaultValue={event?.price || 0}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit">Add Attendee</Button>
                    <Link href={`/app/events/${params.id}`}>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

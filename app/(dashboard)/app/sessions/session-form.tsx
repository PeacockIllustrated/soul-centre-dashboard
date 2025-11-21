"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSession, updateSession } from "./actions";
import Link from "next/link";
import { useState, useEffect } from "react";

interface SessionFormProps {
    session?: any;
    clients: any[];
    services: any[];
    preselectedClientId?: string;
}

export function SessionForm({ session, clients, services, preselectedClientId }: SessionFormProps) {
    const isEditing = !!session;

    // Simple state to handle duration calculation
    const [selectedServiceId, setSelectedServiceId] = useState(session?.service_id || "");
    const [startTime, setStartTime] = useState(session?.start_time ? new Date(session.start_time).toISOString().slice(0, 16) : "");
    const [endTime, setEndTime] = useState(session?.end_time ? new Date(session.end_time).toISOString().slice(0, 16) : "");

    // Update end time when service or start time changes
    useEffect(() => {
        if (selectedServiceId && startTime && !isEditing) {
            const service = services.find(s => s.id === selectedServiceId);
            if (service) {
                const start = new Date(startTime);
                const end = new Date(start.getTime() + service.duration_minutes * 60000);
                // Adjust for timezone offset to keep local time in input
                const offset = end.getTimezoneOffset() * 60000;
                const localEnd = new Date(end.getTime() - offset);
                setEndTime(localEnd.toISOString().slice(0, 16));
            }
        }
    }, [selectedServiceId, startTime, services, isEditing]);

    const handleSubmit = async (formData: FormData) => {
        // Ensure dates are full ISO strings
        const start = new Date(formData.get("start_time") as string);
        const end = new Date(formData.get("end_time") as string);

        formData.set("start_time", start.toISOString());
        formData.set("end_time", end.toISOString());

        if (isEditing) {
            await updateSession(session!.id, formData);
        } else {
            await createSession(formData);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="client_id" className="text-sm font-medium leading-none">
                            Client
                        </label>
                        <select
                            id="client_id"
                            name="client_id"
                            defaultValue={session?.client_id || preselectedClientId || ""}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="" disabled>Select a client</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.first_name} {client.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="service_id" className="text-sm font-medium leading-none">
                            Service
                        </label>
                        <select
                            id="service_id"
                            name="service_id"
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="" disabled>Select a service</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name} ({service.duration_minutes} mins - £{service.base_price})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="start_time" className="text-sm font-medium leading-none">
                            Start Time
                        </label>
                        <Input
                            id="start_time"
                            name="start_time"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="end_time" className="text-sm font-medium leading-none">
                            End Time
                        </label>
                        <Input
                            id="end_time"
                            name="end_time"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium leading-none">
                        Location
                    </label>
                    <Input
                        id="location"
                        name="location"
                        defaultValue={session?.location || "The Soul Centre"}
                        placeholder="e.g. The Soul Centre, Online"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="status" className="text-sm font-medium leading-none">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            defaultValue={session?.status || "booked"}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="booked">Booked</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="no_show">No Show</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="payment_status" className="text-sm font-medium leading-none">
                            Payment Status
                        </label>
                        <select
                            id="payment_status"
                            name="payment_status"
                            defaultValue={session?.payment_status || "unpaid"}
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
                        defaultValue={session?.amount_paid}
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button type="submit">
                    {isEditing ? "Save Changes" : "Create Session"}
                </Button>
                <Link href="/app/sessions">
                    <Button variant="outline" type="button">
                        Cancel
                    </Button>
                </Link>
            </div>
        </form>
    );
}

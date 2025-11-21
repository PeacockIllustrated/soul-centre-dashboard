"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { updateAttendee, removeAttendee } from "../actions";
import { useState } from "react";
import Link from "next/link";

interface AttendeeListProps {
    attendees: any[];
    eventId: string;
}

export function AttendeeList({ attendees, eventId }: AttendeeListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attendees.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                                No attendees yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        attendees.map((attendee) => (
                            <TableRow key={attendee.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/app/clients/${attendee.client_id}`} className="hover:underline">
                                        {attendee.clients?.first_name} {attendee.clients?.last_name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {editingId === attendee.id ? (
                                        <form
                                            action={async (formData) => {
                                                await updateAttendee(attendee.id, eventId, formData);
                                                setEditingId(null);
                                            }}
                                            className="flex items-center gap-2"
                                        >
                                            <select
                                                name="status"
                                                defaultValue={attendee.status}
                                                className="rounded-md border border-gray-300 text-sm"
                                            >
                                                <option value="booked">Booked</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="attended">Attended</option>
                                                <option value="no_show">No Show</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            <select
                                                name="payment_status"
                                                defaultValue={attendee.payment_status}
                                                className="rounded-md border border-gray-300 text-sm"
                                            >
                                                <option value="unpaid">Unpaid</option>
                                                <option value="paid">Paid</option>
                                                <option value="comped">Comped</option>
                                            </select>
                                            <input
                                                type="number"
                                                name="amount_paid"
                                                defaultValue={attendee.amount_paid || 0}
                                                className="w-20 rounded-md border border-gray-300 text-sm"
                                                step="0.01"
                                            />
                                            <Button size="sm" type="submit">Save</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                                        </form>
                                    ) : (
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${attendee.status === "attended"
                                                    ? "bg-green-50 text-green-700"
                                                    : attendee.status === "cancelled" || attendee.status === "no_show"
                                                        ? "bg-red-50 text-red-700"
                                                        : "bg-blue-50 text-blue-700"
                                                }`}
                                        >
                                            {attendee.status}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {!editingId && (
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${attendee.payment_status === "paid"
                                                    ? "bg-green-50 text-green-700"
                                                    : attendee.payment_status === "comped"
                                                        ? "bg-yellow-50 text-yellow-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {attendee.payment_status}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {!editingId && attendee.amount_paid ? `£${attendee.amount_paid}` : !editingId ? "-" : null}
                                </TableCell>
                                <TableCell className="text-right">
                                    {!editingId && (
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setEditingId(attendee.id)}>
                                                Edit
                                            </Button>
                                            <form action={async () => await removeAttendee(attendee.id, eventId)}>
                                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    Remove
                                                </Button>
                                            </form>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

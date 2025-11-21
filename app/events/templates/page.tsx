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
import { Plus, Pencil } from "lucide-react";
import { EventsNav } from "../nav";

export default async function EventTemplatesPage() {
    const supabase = createClient();
    const { data: templates } = await supabase
        .from("event_templates")
        .select("*")
        .order("name");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
                <Link href="/app/events/templates/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Template
                    </Button>
                </Link>
            </div>

            <EventsNav />

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Default Duration</TableHead>
                            <TableHead>Default Price</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {templates?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                    No templates found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            templates?.map((template) => (
                                <TableRow key={template.id}>
                                    <TableCell className="font-medium">{template.name}</TableCell>
                                    <TableCell>{template.default_duration_minutes} mins</TableCell>
                                    <TableCell>£{template.default_price}</TableCell>
                                    <TableCell>{template.default_capacity}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${template.is_active
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {template.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/app/events/templates/${template.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
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

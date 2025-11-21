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

export default async function ServicesPage() {
    const supabase = createClient();
    const { data: services } = await supabase
        .from("services")
        .select("*")
        .order("name");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
                <Link href="/app/services/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Service
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                    No services found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            services?.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.name}</TableCell>
                                    <TableCell className="capitalize">
                                        {service.category?.replace("_", " ")}
                                    </TableCell>
                                    <TableCell>{service.duration_minutes} mins</TableCell>
                                    <TableCell>£{service.base_price}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${service.is_active
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {service.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/app/services/${service.id}`}>
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

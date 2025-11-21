import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

export default async function ClientsPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const supabase = createClient();
    const query = searchParams.q || "";

    let queryBuilder = supabase
        .from("clients")
        .select("*")
        .order("last_name", { ascending: true });

    if (query) {
        queryBuilder = queryBuilder.or(
            `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`
        );
    }

    const { data: clients, error } = await queryBuilder;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
                <Link href="/app/clients/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Client
                    </Button>
                </Link>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <form>
                        <Input
                            name="q"
                            placeholder="Search clients..."
                            className="pl-9"
                            defaultValue={query}
                        />
                    </form>
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                                    No clients found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients?.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/app/clients/${client.id}`}
                                            className="hover:underline"
                                        >
                                            {client.first_name} {client.last_name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{client.email || "-"}</TableCell>
                                    <TableCell>{client.phone || "-"}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${client.is_active
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {client.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/app/clients/${client.id}`}>
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

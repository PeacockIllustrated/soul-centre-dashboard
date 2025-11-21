"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSession(formData: FormData) {
    const supabase = createClient();

    const client_id = formData.get("client_id") as string;
    const service_id = formData.get("service_id") as string;
    const start_time = formData.get("start_time") as string; // ISO string expected
    const end_time = formData.get("end_time") as string;     // ISO string expected
    const location = formData.get("location") as string;
    const status = formData.get("status") as string;
    const payment_status = formData.get("payment_status") as string;
    const amount_paid = formData.get("amount_paid") ? parseFloat(formData.get("amount_paid") as string) : null;

    const { error } = await supabase.from("sessions").insert({
        client_id,
        service_id,
        start_time,
        end_time,
        location,
        status: status as any,
        payment_status: payment_status as any,
        amount_paid,
    });

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/app/sessions");
    revalidatePath(`/app/clients/${client_id}`);
    redirect("/app/sessions");
}

export async function updateSession(id: string, formData: FormData) {
    const supabase = createClient();

    const client_id = formData.get("client_id") as string;
    const service_id = formData.get("service_id") as string;
    const start_time = formData.get("start_time") as string;
    const end_time = formData.get("end_time") as string;
    const location = formData.get("location") as string;
    const status = formData.get("status") as string;
    const payment_status = formData.get("payment_status") as string;
    const amount_paid = formData.get("amount_paid") ? parseFloat(formData.get("amount_paid") as string) : null;

    const { error } = await supabase
        .from("sessions")
        .update({
            client_id,
            service_id,
            start_time,
            end_time,
            location,
            status: status as any,
            payment_status: payment_status as any,
            amount_paid,
        })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/app/sessions");
    revalidatePath(`/app/sessions/${id}`);
    revalidatePath(`/app/clients/${client_id}`);
    redirect("/app/sessions");
}

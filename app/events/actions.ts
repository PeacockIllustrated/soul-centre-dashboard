"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEventTemplate(formData: FormData) {
    const supabase = createClient();

    const name = formData.get("name") as string;
    const default_description = formData.get("default_description") as string;
    const default_duration_minutes = parseInt(formData.get("default_duration_minutes") as string);
    const default_price = parseFloat(formData.get("default_price") as string);
    const default_capacity = parseInt(formData.get("default_capacity") as string);
    const default_location = formData.get("default_location") as string;
    const is_active = formData.get("is_active") === "on";

    const { error } = await supabase.from("event_templates").insert({
        name,
        default_description,
        default_duration_minutes,
        default_price,
        default_capacity,
        default_location,
        is_active,
    });

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/app/events/templates");
    redirect("/app/events/templates");
}

export async function updateEventTemplate(id: string, formData: FormData) {
    const supabase = createClient();

    const name = formData.get("name") as string;
    const default_description = formData.get("default_description") as string;
    const default_duration_minutes = parseInt(formData.get("default_duration_minutes") as string);
    const default_price = parseFloat(formData.get("default_price") as string);
    const default_capacity = parseInt(formData.get("default_capacity") as string);
    const default_location = formData.get("default_location") as string;
    const is_active = formData.get("is_active") === "on";

    const { error } = await supabase
        .from("event_templates")
        .update({
            name,
            default_description,
            default_duration_minutes,
            default_price,
            default_capacity,
            default_location,
            is_active,
        })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/app/events/templates");
    revalidatePath(`/app/events/templates/${id}`);
    redirect("/app/events/templates");
}

export async function createEventInstance(formData: FormData) {
    const supabase = createClient();

    const event_template_id = formData.get("event_template_id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const start_time = formData.get("start_time") as string;
    const end_time = formData.get("end_time") as string;
    const location = formData.get("location") as string;
    const capacity = parseInt(formData.get("capacity") as string);
    const price = parseFloat(formData.get("price") as string);
    const status = formData.get("status") as string;

    const { error } = await supabase.from("event_instances").insert({
        event_template_id: event_template_id || null,
        title,
        description,
        start_time,
        end_time,
        location,
        capacity,
        price,
        status: status as any,
    });

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/app/events");
    redirect("/app/events");
}

export async function updateEventInstance(id: string, formData: FormData) {
    const supabase = createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const start_time = formData.get("start_time") as string;
    const end_time = formData.get("end_time") as string;
    const location = formData.get("location") as string;
    const capacity = parseInt(formData.get("capacity") as string);
    const price = parseFloat(formData.get("price") as string);
    const status = formData.get("status") as string;

    const { error } = await supabase
        .from("event_instances")
        .update({
            title,
            description,
            start_time,
            end_time,
            location,
            capacity,
            price,
            status: status as any,
        })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/app/events");
    revalidatePath(`/app/events/${id}`);
    redirect(`/app/events/${id}`);
}

export async function addAttendee(formData: FormData) {
    const supabase = createClient();

    const event_instance_id = formData.get("event_instance_id") as string;
    const client_id = formData.get("client_id") as string;
    const status = formData.get("status") as string;
    const payment_status = formData.get("payment_status") as string;
    const amount_paid = formData.get("amount_paid") ? parseFloat(formData.get("amount_paid") as string) : null;

    const { error } = await supabase.from("event_attendees").insert({
        event_instance_id,
        client_id,
        status: status as any,
        payment_status: payment_status as any,
        amount_paid,
    });

    if (error) {
        // Handle unique constraint violation (already booked) gracefully if needed
        throw new Error(error.message);
    }

    revalidatePath(`/app/events/${event_instance_id}`);
    redirect(`/app/events/${event_instance_id}`);
}

export async function updateAttendee(id: string, event_instance_id: string, formData: FormData) {
    const supabase = createClient();

    const status = formData.get("status") as string;
    const payment_status = formData.get("payment_status") as string;
    const amount_paid = formData.get("amount_paid") ? parseFloat(formData.get("amount_paid") as string) : null;

    const { error } = await supabase
        .from("event_attendees")
        .update({
            status: status as any,
            payment_status: payment_status as any,
            amount_paid,
        })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath(`/app/events/${event_instance_id}`);
}

export async function removeAttendee(id: string, event_instance_id: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from("event_attendees")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath(`/app/events/${event_instance_id}`);
}

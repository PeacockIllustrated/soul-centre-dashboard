"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createService(formData: FormData) {
    const supabase = createClient();

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const duration_minutes = parseInt(formData.get("duration_minutes") as string);
    const base_price = parseFloat(formData.get("base_price") as string);
    const is_active = formData.get("is_active") === "on";

    const { error } = await supabase.from("services").insert({
        name,
        category: category as any,
        description,
        duration_minutes,
        base_price,
        is_active,
    });

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/app/services");
    redirect("/app/services");
}

export async function updateService(id: string, formData: FormData) {
    const supabase = createClient();

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const duration_minutes = parseInt(formData.get("duration_minutes") as string);
    const base_price = parseFloat(formData.get("base_price") as string);
    const is_active = formData.get("is_active") === "on";

    const { error } = await supabase
        .from("services")
        .update({
            name,
            category: category as any,
            description,
            duration_minutes,
            base_price,
            is_active,
        })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/app/services");
    revalidatePath(`/app/services/${id}`);
    redirect("/app/services");
}

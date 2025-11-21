"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBrandSettings(formData: FormData) {
    const supabase = createClient();

    const company_name = formData.get("company_name") as string;
    const website_url = formData.get("website_url") as string;
    const support_email = formData.get("support_email") as string;
    const primary_color = formData.get("primary_color") as string;

    // Check if a record exists
    const { data: existing } = await supabase.from("brand_settings").select("id").single();

    let error;
    if (existing) {
        const result = await supabase
            .from("brand_settings")
            .update({
                company_name,
                website_url,
                support_email,
                primary_color,
            })
            .eq("id", existing.id);
        error = result.error;
    } else {
        const result = await supabase
            .from("brand_settings")
            .insert({
                company_name,
                website_url,
                support_email,
                primary_color,
            });
        error = result.error;
    }

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/app/settings");
}

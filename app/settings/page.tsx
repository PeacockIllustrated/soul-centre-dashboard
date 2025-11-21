import { createClient } from "@/lib/supabase/server";
import { BrandSettingsForm } from "./brand-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
    const supabase = createClient();
    const { data: settings } = await supabase.from("brand_settings").select("*").single();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">
                    Manage your brand and account settings.
                </p>
            </div>

            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Brand Settings</CardTitle>
                        <CardDescription>
                            Configure how your business appears to clients.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BrandSettingsForm settings={settings} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                            Your personal account information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Email</label>
                            <div className="p-2 bg-gray-50 rounded border text-sm text-gray-600">
                                {user?.email}
                            </div>
                            <p className="text-xs text-gray-400">
                                Managed via Supabase Auth.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

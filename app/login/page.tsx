import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    const signIn = async (formData: FormData) => {
        "use server";

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        return redirect("/app");
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div className="w-full max-w-md space-y-8 px-4">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        The Soul Centre
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your dashboard
                    </p>
                </div>
                <form className="mt-8 space-y-6" action={signIn}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                    {searchParams?.message && (
                        <p className="mt-2 text-center text-sm text-red-600">
                            {searchParams.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

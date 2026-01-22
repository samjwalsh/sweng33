"use client";

import { authClient } from "@/server/better-auth/client";

export function SignInButtons() {
    return (
        <div className="flex flex-col gap-4">
            <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                onClick={async () => {
                    await authClient.signIn.social({
                        provider: "google",
                        callbackURL: "/",
                    });
                }}
            >
                Sign in with Google
            </button>
        </div>
    );
}

export function SignOutButton() {
    return (
        <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            onClick={async () => {
                await authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            window.location.reload();
                        },
                    },
                });
            }}
        >
            Sign out
        </button>
    );
}

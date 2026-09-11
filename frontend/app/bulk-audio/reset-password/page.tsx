import { ResetPassword } from "@/app/components/pages/ResetPassword/ResetPassword";
import { Suspense } from "react";



export default function ForgotPasswordPage() {
    return <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
        <ResetPassword />
    </Suspense>
}
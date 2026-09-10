import { Suspense } from "react";
import { Login } from "@/app/components/pages/Login/Login";

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
      }
    >
      <Login />
    </Suspense>
  );
};

export default LoginPage;
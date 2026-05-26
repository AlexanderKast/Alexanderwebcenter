import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin · Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[color:var(--background)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Image
            src="/logos/ac-gold-mark.png"
            alt="Alexander Cast"
            width={200}
            height={122}
            priority
            className="mx-auto h-16 w-auto"
          />
          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[color:var(--gold-mid)]">
            Alexander Cast · Admin
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-white md:text-4xl">
            Bienvenido <span className="text-gold-shimmer">de vuelta.</span>
          </h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

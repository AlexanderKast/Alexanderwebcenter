import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

/** Réplica del `.st-social-group` de Davis: cápsula oscura con 4 redes. */
export function SocialCapsule({ className }: { className?: string }) {
  const items: { label: string; href: string; Icon: () => React.ReactElement }[] = [
    {
      label: "Instagram",
      href: site.social.instagram.url,
      Icon: () => (
        <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: site.social.linkedin.url,
      Icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.5 0h4.37v1.92h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.02 5.42 6.94V22h-4.56v-6.16c0-1.47-.03-3.36-2.05-3.36-2.05 0-2.36 1.6-2.36 3.25V22H7.72V8z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: site.social.youtube.url,
      Icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-5.8 31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
        </svg>
      ),
    },
    {
      label: "X",
      href: site.social.x.url,
      Icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
          <path d="M18.244 2H21.5l-7.5 8.58L23 22h-6.88l-5.4-7.03L4.47 22H1.21l8.04-9.2L.5 2h7.06l4.89 6.47L18.24 2zm-2.42 18h2l-6.4-8.48-2 2.3L15.82 20z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={cn(
        "social-capsule inline-flex items-center gap-1 px-3 py-2",
        className,
      )}
    >
      {items.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          className="grid size-10 place-items-center rounded-full text-white/70 transition-colors hover:bg-[color:var(--gold)] hover:text-[color:var(--brand)]"
        >
          <s.Icon />
        </Link>
      ))}
    </div>
  );
}

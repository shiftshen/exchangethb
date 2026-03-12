import { ReactNode } from 'react';

export function Pill({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300">{children}</span>;
}

export function ChoiceChip({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex min-h-11 items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium transition ${
        active
          ? 'border-brand-400 bg-brand-500 text-surface-950 shadow-glow'
          : 'border-white/10 bg-surface-800 text-stone-200 hover:border-brand-500/40 hover:text-brand-300'
      }`}
    >
      {children}
    </span>
  );
}

export function StatCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-surface-800/80 p-5">
      <p className="text-sm text-stone-400">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-stone-500">{hint}</p>
    </div>
  );
}

export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="section-title">{title}</h2>
        {description ? <p className="max-w-3xl text-stone-400">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

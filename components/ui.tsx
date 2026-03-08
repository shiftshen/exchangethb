import { ReactNode } from 'react';

export function Pill({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{children}</span>;
}

export function StatCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-stone-500">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-2 text-sm text-stone-500">{hint}</p>
    </div>
  );
}

export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="section-title">{title}</h2>
        {description ? <p className="max-w-3xl text-stone-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

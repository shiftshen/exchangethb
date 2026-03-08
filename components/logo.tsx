export function Logo() {
  return (
    <div className="flex items-center gap-3 font-semibold text-brand-900">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-soft">
        <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 46V18H30C36 18 40 21 40 27C40 31 38 34 34 35V36C39 37 42 40 42 45C42 52 37 56 28 56H18" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M46 16V48" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
          <path d="M40 22L46 16L52 22" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div>
        <div className="text-lg tracking-tight">ExchangeTHB</div>
        <div className="text-xs font-medium uppercase tracking-[0.24em] text-brand-500">Thai Baht Finder</div>
      </div>
    </div>
  );
}

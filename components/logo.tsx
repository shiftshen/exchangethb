export function Logo() {
  return (
    <div className="flex items-center gap-3 text-white">
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[18px] border border-brand-500/30 bg-[linear-gradient(145deg,#171b22_0%,#0f1318_100%)] text-brand-500 shadow-glow">
        <div className="absolute inset-[5px] rounded-[14px] border border-white/10" />
        <svg viewBox="0 0 64 64" className="relative h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 14H24.5C31.348 14 36 17.813 36 23.5C36 27.479 33.875 30.311 30 31.5C34.778 32.844 37.5 36.153 37.5 41C37.5 47.743 32.065 51 24.5 51H13V14Z" fill="#F6F3EA"/>
          <path d="M20 20V29H24C27.924 29 30 27.302 30 24.5C30 21.588 27.816 20 24 20H20Z" fill="#0F1318"/>
          <path d="M20 35V45H24.5C29.084 45 31.5 43.196 31.5 40C31.5 36.696 28.924 35 24 35H20Z" fill="#0F1318"/>
          <path d="M46 15V43" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
          <path d="M40 21L46 15L52 21" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="46" cy="49" r="4.5" fill="currentColor"/>
        </svg>
      </div>
      <div className="leading-none">
        <div className="font-serif text-[1.24rem] font-semibold tracking-[-0.03em] text-stone-50">ExchangeTHB</div>
        <div className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.36em] text-brand-400">Thai Baht Intelligence</div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useFullPage } from '@/components/layout/FullPage';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { CONTACT_EMAIL, CONTACT_QQ, GITHUB_HANDLE, GITHUB_URL } from '@/lib/contact';

const SECTIONS: { label: string; idx: number }[] = [
  { label: 'About',      idx: 1 },
  { label: 'Projects',   idx: 2 },
  { label: 'Skills',     idx: 3 },
  { label: 'Experience', idx: 4 },
  { label: 'Contact',    idx: 5 },
];

export default function Navbar() {
  const { current, goTo }           = useFullPage();
  const [open,       setOpen]       = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const { copied, copy: copyEmail } = useCopyToClipboard(CONTACT_EMAIL);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setMobileOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleNav = (idx: number) => { goTo(idx); setMobileOpen(false); };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-8 py-6">

        {/* logo */}
        <button
          onClick={() => goTo(0)}
          className="font-bold text-white text-sm tracking-[0.15em] uppercase select-none hover:opacity-70 transition-opacity duration-200"
        >
          AccEEden
        </button>

        {/* desktop nav links */}
        <div className="hidden md:flex items-center gap-10">
          {SECTIONS.map(({ label, idx }) => (
            <button
              key={label}
              onClick={() => goTo(idx)}
              className={`text-sm tracking-wide transition-colors duration-300 ${current === idx ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* right side */}
        <div className="flex items-center gap-3">
          {/* Contact / Hire dropdown */}
          <div ref={dropRef} className="relative hidden md:block">
            <button
              onClick={() => setOpen((v) => !v)}
              className={`text-xs font-mono border rounded-full px-5 py-2 transition-all duration-300 tracking-wider select-none ${open ? 'border-white/40 text-white bg-white/[0.04]' : 'border-white/15 text-white/70 hover:border-white/35 hover:text-white'}`}
            >
              Contact / Hire
            </button>

            {open && (
              <div
                className="absolute right-0 top-full mt-3 w-[290px] border border-white/[0.08] rounded-2xl p-5 bg-[#080808]/95 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
                style={{ zIndex: 600 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400/75 tracking-[0.2em] uppercase">
                    Available for hire
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="border border-white/[0.07] rounded-xl p-3.5">
                    <p className="font-mono text-[9px] text-white/25 tracking-[0.2em] mb-1.5">EMAIL</p>
                    <p className="text-[13px] font-mono text-white/75 mb-3 truncate">{CONTACT_EMAIL}</p>
                    <div className="flex gap-2">
                      <a
                        href={`https://mail.qq.com/cgi-bin/compose_mail?to=${CONTACT_EMAIL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] text-white/40 border border-white/[0.08] rounded-full px-3 py-1 hover:text-white/70 hover:border-white/25 transition-all"
                      >
                        QQ MAIL
                      </a>
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] text-white/40 border border-white/[0.08] rounded-full px-3 py-1 hover:text-white/70 hover:border-white/25 transition-all"
                      >
                        GMAIL
                      </a>
                      <button
                        onClick={copyEmail}
                        className={`font-mono text-[10px] border rounded-full px-3 py-1 transition-all ${copied ? 'text-emerald-400/85 border-emerald-400/30 bg-emerald-400/[0.06]' : 'text-white/40 border-white/[0.08] hover:text-white/70 hover:border-white/25'}`}
                      >
                        {copied ? 'COPIED ✓' : 'COPY'}
                      </button>
                    </div>
                  </div>

                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-white/[0.07] rounded-xl p-3.5 flex items-center justify-between hover:border-white/[0.18] hover:bg-white/[0.02] transition-all group block"
                  >
                    <div>
                      <p className="font-mono text-[9px] text-white/25 tracking-[0.2em] mb-1">GITHUB</p>
                      <p className="text-[13px] font-mono text-white/65 group-hover:text-white/90 transition-colors">
                        {GITHUB_HANDLE}
                      </p>
                    </div>
                    <span className="text-white/20 group-hover:text-white/55 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </a>

                  <div className="border border-white/[0.07] rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[9px] text-white/25 tracking-[0.2em] mb-1">QQ</p>
                      <p className="text-[13px] font-mono text-white/60">{CONTACT_QQ}</p>
                    </div>
                    <span className="font-mono text-[9px] text-white/22 tracking-widest">CN</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {['Internships', 'AI Engineering', 'Data Engineering', 'Open Source'].map((t) => (
                    <span key={t} className="font-mono text-[9px] text-white/30 border border-white/[0.07] rounded-full px-2.5 py-0.5 tracking-wide">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-1"
          >
            <span className={`block h-px bg-white/70 transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block h-px bg-white/70 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-px bg-white/70 transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* mobile full-screen menu */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-[490] bg-[#080808]/97 backdrop-blur-xl flex flex-col justify-center items-center gap-8 md:hidden"
          onClick={(e) => { if (e.target === e.currentTarget) setMobileOpen(false); }}
        >
          {SECTIONS.map(({ label, idx }) => (
            <button
              key={label}
              onClick={() => handleNav(idx)}
              className={`text-3xl font-bold tracking-tight transition-colors duration-200 ${current === idx ? 'text-white' : 'text-white/35 hover:text-white/80'}`}
            >
              {label}
            </button>
          ))}
          <div className="mt-6 flex flex-col items-center gap-3">
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-sm text-white/50 hover:text-white transition-colors">
              {CONTACT_EMAIL}
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-white/35 hover:text-white/70 transition-colors">
              GitHub ↗
            </a>
          </div>
        </div>
      )}
    </>
  );
}

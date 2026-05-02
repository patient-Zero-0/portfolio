'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { CONTACT_EMAIL, CONTACT_QQ, GITHUB_HANDLE, GITHUB_URL } from '@/lib/contact';

const MAIL_OPTIONS = [
  {
    label: 'QQ Mail',
    hint:  'mail.qq.com',
    url:   'https://mail.qq.com/',
  },
  {
    label: 'Gmail',
    hint:  'mail.google.com',
    url:   'https://mail.google.com/mail/u/0/',
  },
];

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const mailRef     = useRef<HTMLDivElement>(null);
  const [fired,     setFired]     = useState(false);
  const [mailOpen,  setMailOpen]  = useState(false);
  const { copied, copy: copyEmail } = useCopyToClipboard(CONTACT_EMAIL);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mailRef.current && !mailRef.current.contains(e.target as Node)) setMailOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setFired(true); obs.disconnect(); } },
      { threshold: 0.05 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const fadeIn = (delay = 0): CSSProperties => ({
    opacity:    fired ? 1 : 0,
    transform:  fired ? 'none' : 'translateY(20px)',
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  });

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full min-h-screen flex flex-col py-24 md:py-28"
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col flex-1 gap-8">

        {/* ── header ── */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-white/25 tracking-[0.2em]">§ 05</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="font-mono text-xs text-white/20 tracking-[0.15em]">CONTACT</span>
        </div>

        {/* ── headline ── */}
        <div style={fadeIn(0.05)}>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none">
            Let&apos;s build
            <br />
            <span className="text-white/28">something.</span>
          </h2>

          <div className="flex items-center gap-2 mt-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] text-emerald-400/75 tracking-[0.18em]">
              OPEN TO INTERNSHIPS &amp; COLLABORATIONS
            </span>
          </div>
        </div>

        {/* ── divider ── */}
        <div className="h-px bg-white/[0.06]" style={fadeIn(0.1)} />

        {/* ── contact grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" style={fadeIn(0.13)}>

          {/* email — primary */}
          <div
            className="lg:col-span-3 border border-white/[0.08] rounded-2xl p-7 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.16] transition-all duration-300 flex flex-col gap-5"
          >
            <span className="font-mono text-[10px] text-white/22 tracking-[0.25em]">
              PRIMARY CONTACT
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-xl md:text-[22px] font-bold text-white/80 hover:text-white transition-colors duration-200 tracking-tight break-all leading-tight"
            >
              {CONTACT_EMAIL}
            </a>
            <div className="flex flex-wrap gap-2.5 mt-auto">
              {/* Mail picker */}
              <div ref={mailRef} className="relative">
                <button
                  onClick={() => setMailOpen((v) => !v)}
                  className={`font-mono text-[10px] border rounded-full px-4 py-1.5 transition-all duration-200 tracking-wider ${mailOpen ? 'border-white/30 text-white/70' : 'border-white/[0.10] text-white/40 hover:border-white/30 hover:text-white/70'}`}
                >
                  OPEN MAIL CLIENT ▾
                </button>

                {mailOpen && (
                  <div className="absolute left-0 top-full mt-2 w-52 border border-white/[0.09] rounded-xl bg-[#0d0d0d]/95 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                    {MAIL_OPTIONS.map(({ label, hint, url }) => (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMailOpen(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.04] transition-colors duration-150 group"
                      >
                        <div>
                          <p className="font-mono text-[11px] text-white/65 group-hover:text-white/90 transition-colors">{label}</p>
                          <p className="font-mono text-[9px] text-white/22 mt-0.5">{hint}</p>
                        </div>
                        <span className="text-white/18 group-hover:text-white/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={copyEmail}
                className={`font-mono text-[10px] border rounded-full px-4 py-1.5 tracking-wider transition-all duration-300 ${copied ? 'text-emerald-400/80 border-emerald-400/30 bg-emerald-400/[0.07]' : 'text-white/40 border-white/[0.10] hover:border-white/30 hover:text-white/70'}`}
              >
                {copied ? 'COPIED ✓' : 'COPY ADDRESS'}
              </button>
            </div>
          </div>

          {/* secondary links */}
          <div className="lg:col-span-2 flex flex-col gap-3">

            {/* GitHub */}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-white/[0.07] rounded-xl p-5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-300 group flex-1"
            >
              <div>
                <span className="font-mono text-[10px] text-white/22 tracking-[0.2em]">GITHUB</span>
                <p className="text-sm font-bold text-white/65 group-hover:text-white mt-1 transition-colors duration-200 tracking-tight">
                  {GITHUB_HANDLE}
                </p>
              </div>
              <span className="font-mono text-white/15 group-hover:text-white/50 text-xl group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                ↗
              </span>
            </a>

            {/* QQ */}
            <div
              className="flex items-center justify-between border border-white/[0.07] rounded-xl p-5 bg-white/[0.02] transition-all duration-300 flex-1"
            >
              <div>
                <span className="font-mono text-[10px] text-white/22 tracking-[0.2em]">QQ</span>
                <p className="text-sm font-bold text-white/45 mt-1 tracking-tight">
                  {CONTACT_QQ}
                </p>
              </div>
              <span className="font-mono text-[9px] text-white/12 tracking-widest">CN</span>
            </div>

          </div>
        </div>

        {/* ── availability chips ── */}
        <div className="flex flex-wrap gap-2" style={fadeIn(0.2)}>
          {[
            'Internships',
            'AI Engineering',
            'Data Engineering',
            'Open Source',
            'Collaborations',
          ].map((label) => (
            <span
              key={label}
              className="font-mono text-[10px] text-white/28 border border-white/[0.07] rounded-full px-3 py-1 tracking-wider"
            >
              {label}
            </span>
          ))}
        </div>

        {/* ── quote ── */}
        <div
          className="border-l border-white/[0.12] pl-5 max-w-lg"
          style={fadeIn(0.24)}
        >
          <p className="text-[13px] text-white/32 leading-[1.9] italic">
            &ldquo;I learn fast, ship things I care about, and bring the rigor of
            applied mathematics to every engineering problem I touch.&rdquo;
          </p>
        </div>

        {/* ── footer ── */}
        <div
          className="mt-auto pt-6 border-t border-white/[0.05]"
          style={fadeIn(0.28)}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <span className="font-mono text-[10px] text-white/18 tracking-wider">
              © 2026 AccEEden · Built with Next.js &amp; Claude Code
            </span>
            <span className="font-mono text-[10px] text-white/10 tracking-wider">
              MATH &amp; APPLIED MATHEMATICS
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

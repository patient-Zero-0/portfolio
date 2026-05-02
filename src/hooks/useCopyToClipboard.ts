'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useCopyToClipboard(text: string, resetMs = 2200) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), resetMs);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }, [text, resetMs]);

  return { copied, copy };
}

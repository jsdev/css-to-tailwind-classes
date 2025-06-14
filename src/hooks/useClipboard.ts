import { useState, useCallback } from 'react';

export function useClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  return { copiedText, copyToClipboard };
}
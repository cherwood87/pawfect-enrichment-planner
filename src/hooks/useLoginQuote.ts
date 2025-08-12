import { useEffect, useMemo, useState } from 'react';
import { QUOTES, QuoteItem } from '@/data/quotes';

// Shows a new quote on each login/session, cycling through available quotes
export function useLoginQuote(customQuotes?: QuoteItem[]) {
  const quotes = useMemo(() => (customQuotes && customQuotes.length > 0 ? customQuotes : QUOTES), [customQuotes]);

  const STORAGE_INDEX_KEY = 'loginQuote:index:v2';
  const STORAGE_SESSION_KEY = 'loginQuote:sessionId:v2';
  
  const [index, setIndex] = useState<number>(0);

  // Generate a session ID that changes on each page load/login
  const sessionId = useMemo(() => Date.now().toString(), []);

  useEffect(() => {
    try {
      const storedSessionId = localStorage.getItem(STORAGE_SESSION_KEY);
      const storedIndex = localStorage.getItem(STORAGE_INDEX_KEY);

      // If this is the same session, use the stored quote
      if (storedSessionId === sessionId && storedIndex !== null) {
        const parsed = parseInt(storedIndex, 10);
        if (!Number.isNaN(parsed) && parsed >= 0 && parsed < quotes.length) {
          setIndex(parsed);
          return;
        }
      }

      // New session - get next quote in sequence
      let nextIndex = 0;
      if (storedIndex !== null) {
        const lastIndex = parseInt(storedIndex, 10);
        if (!Number.isNaN(lastIndex)) {
          // Cycle to next quote, wrapping around at the end
          nextIndex = (lastIndex + 1) % quotes.length;
        }
      }

      setIndex(nextIndex);
      localStorage.setItem(STORAGE_SESSION_KEY, sessionId);
      localStorage.setItem(STORAGE_INDEX_KEY, String(nextIndex));
    } catch (e) {
      // Fallback: deterministic index based on timestamp
      const fallbackIndex = Math.floor(Date.now() / 1000) % Math.max(quotes.length, 1);
      setIndex(fallbackIndex);
    }
  }, [sessionId, quotes.length]);

  const quote = quotes[index] ?? { text: 'Keep enriching – small steps make big changes.' };

  return { quote };
}
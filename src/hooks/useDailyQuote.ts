import { useEffect, useMemo, useState, useCallback } from 'react';
import { QUOTES, QuoteItem } from '@/data/quotes';

// Rotates a quote once per day, with an option to shuffle on demand
export function useDailyQuote(customQuotes?: QuoteItem[]) {
  const quotes = useMemo(() => (customQuotes && customQuotes.length > 0 ? customQuotes : QUOTES), [customQuotes]);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const STORAGE_INDEX_KEY = 'dailyQuote:index:v1';
  const STORAGE_DATE_KEY = 'dailyQuote:date:v1';

  const [index, setIndex] = useState<number>(0);

  // Initialize from localStorage and ensure once-per-day rotation
  useEffect(() => {
    try {
      const storedDate = localStorage.getItem(STORAGE_DATE_KEY);
      const storedIndex = localStorage.getItem(STORAGE_INDEX_KEY);

      if (storedDate === today && storedIndex !== null) {
        const parsed = parseInt(storedIndex, 10);
        if (!Number.isNaN(parsed) && parsed >= 0 && parsed < quotes.length) {
          setIndex(parsed);
          return;
        }
      }

      // Pick a new quote for today
      const newIndex = quotes.length > 0 ? Math.floor(Math.random() * quotes.length) : 0;
      setIndex(newIndex);
      localStorage.setItem(STORAGE_DATE_KEY, today);
      localStorage.setItem(STORAGE_INDEX_KEY, String(newIndex));
    } catch (e) {
      // Fallback: deterministic index based on date
      const seed = today.split('-').join('');
      const seeded = Number(seed) % Math.max(quotes.length, 1);
      setIndex(seeded);
    }
  }, [today, quotes.length]);

  const shuffleNow = useCallback(() => {
    if (quotes.length === 0) return;
    let newIndex = Math.floor(Math.random() * quotes.length);
    if (quotes.length > 1) {
      // avoid repeating the same quote
      while (newIndex === index) {
        newIndex = Math.floor(Math.random() * quotes.length);
      }
    }
    setIndex(newIndex);
    try {
      localStorage.setItem(STORAGE_INDEX_KEY, String(newIndex));
      localStorage.setItem(STORAGE_DATE_KEY, today); // still tied to today
    } catch {}
  }, [index, quotes.length, today]);

  const quote = quotes[index] ?? { text: 'Keep enriching – small steps make big changes.' };

  return { quote, shuffleNow } as { quote: QuoteItem; shuffleNow: () => void };
}

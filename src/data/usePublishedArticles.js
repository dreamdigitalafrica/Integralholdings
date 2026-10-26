import { useEffect, useState } from 'react';
import { websiteStories } from './websiteStories';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function usePublishedArticles(slug) {
  const connected = Boolean(url && key);
  const [result, setResult] = useState({stories: connected ? [] : websiteStories, loading: connected, error: ''});
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!connected) return;
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setResult({stories: [], loading: true, error: ''});
    async function load() {
      try {
        const params = new URLSearchParams({
          select: 'slug,title,published_at,image_url,image_alt,data', kind: 'eq.articles',
          status: 'eq.published', published_at: `lte.${new Date().toISOString()}`,
          order: 'published_at.desc', limit: '100',
        });
        if (slug) params.set('slug', `eq.${slug}`);
        // Public reads never use the staff session, even when an editor is signed in.
        const response = await fetch(`${url}/rest/v1/cms_content?${params}`, {
          headers: {apikey: key}, signal: controller.signal, cache: 'no-store',
        });
        if (!response.ok) throw new Error('Unable to load articles. Please try again.');
        const records = await response.json();
        if (!active) return;
        setResult({loading: false, error: '', stories: records.map(record => ({
          slug: record.slug, title: record.title, image: record.image_url, alt: record.image_alt || '',
          date: new Date(record.published_at).toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric', timeZone:'Africa/Lagos'}),
          category: record.data.category || 'News', summary: record.data.summary || '',
          author: record.data.author || 'Integral Editorial', body: record.data.body || '', url: record.data.source_url || '',
        }))});
      } catch (error) {
        if (active) setResult({stories: [], loading: false, error: error.name === 'AbortError' ? 'The request timed out. Please try again.' : error.message});
      } finally { clearTimeout(timeout); }
    }
    load();
    return () => {active = false; clearTimeout(timeout); controller.abort();};
  }, [connected, slug, attempt]);
  return {...result, retry: () => setAttempt(value => value + 1)};
}

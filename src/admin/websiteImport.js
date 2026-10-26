import { websiteStories } from '../data/websiteStories';

const escapeHTML = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export const websiteArticles = websiteStories.map(story => ({
  kind: 'articles', title: story.title, slug: story.slug,
  sector: story.category === 'Mobility' ? 'Automobiles' : story.category === 'Energy' ? 'Energy' : 'Group',
  status: 'published', published_at: `${story.url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//).slice(1).join('-')}T00:00:00.000Z`,
  image_url: story.image, image_alt: '',
  data: {
    summary: story.summary, category: story.category, author: 'TechCabal', source_url: story.url,
    body: `<p>This is a brief introduction to a story published by TechCabal. Read the original reporting for the full context, reporting and sources.</p><p><a href="${escapeHTML(story.url)}">Read the full story on TechCabal</a></p>`,
    seo_title: story.title, seo_description: story.summary,
  },
}));

export const websiteMedia = websiteStories.map(story => ({
  id: `website-${story.slug}`, name: story.title, alt: '', url: story.image, bytes: 0,
}));

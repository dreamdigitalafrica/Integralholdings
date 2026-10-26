import { supabase } from './client';
import { websiteArticles, websiteMedia } from './websiteImport';
import { existingPeople } from './peopleImport';

const key = 'integral-admin-demo-v1';
const seed = () => ({
  cms_content: [
    { id: 'sample-article', kind: 'articles', title: 'Inside Integral Holdings', slug: 'inside-integral-holdings', sector: 'Group', status: 'draft', published_at: null, image_url: '/integral/business-tablet-800.webp', image_alt: 'Business colleagues reviewing a tablet', data: { summary: 'A sample draft for exploring the editorial workspace.', category: 'Company updates', author: 'Integral Editorial', body: '<p>Introduce a company update here.</p>' }, updated_at: new Date().toISOString(), version: 1 },
    { id: 'sample-job', kind: 'jobs', title: 'Operations coordinator', slug: 'operations-coordinator', sector: 'Group', status: 'draft', data: { department: 'Operations', location: 'Lagos', employment: 'Full-time', workplace: 'On-site' }, updated_at: new Date().toISOString(), version: 1 },
    { id: 'sample-course', kind: 'courses', title: 'Introduction to greenhouse farming', slug: 'greenhouse-farming', sector: 'Agriculture', status: 'draft', data: { delivery: 'In person', duration: '4 weeks', capacity: 20, fee: 0 }, updated_at: new Date().toISOString(), version: 1 },
  ], cms_submissions: [], cms_media: [
    { id: 'demo-business', name: 'Business collaboration', alt: 'Business colleagues reviewing a tablet', url: '/integral/business-tablet-800.webp', bytes: 100000 },
    { id: 'demo-industrial', name: 'Industrial facilities', alt: 'Industrial towers and storage tank', url: '/integral/energy-towers-800.webp', bytes: 120000 },
  ], cms_revisions: [], cms_staff: [{ id: 'demo', name: 'Local administrator', role: 'admin', active: true }],
});
function read() {
  const raw = localStorage.getItem(key); const db = raw ? JSON.parse(raw) : seed();
  for (const table of ['cms_inquiries','cms_events','cms_notification_reads']) db[table] ||= [];
  if (!db.peopleImported) {
    for (const person of existingPeople) {
      if (!db.cms_content.some(row=>row.kind==='people'&&row.slug===person.slug)) db.cms_content.push({...person,id:`person-${person.slug}`,version:1,updated_at:person.published_at});
    }
    db.peopleImported=true; write(db);
  }
  if (!db.websiteArticlesImported) {
    for (const article of websiteArticles) {
      if (!db.cms_content.some(row => row.kind === 'articles' && row.slug === article.slug)) {
        db.cms_content.push({...article, id:`website-${article.slug}`, version:1, updated_at:article.published_at});
      }
    }
    for (const image of websiteMedia) if (!db.cms_media.some(row => row.url === image.url)) db.cms_media.push(image);
    db.websiteArticlesImported = true;
    write(db);
  }
  return db;
}

export async function importWebsiteArticles(kind = 'articles') {
  const existing = await list('cms_content', {kind});
  let imported = 0;
  for (const article of kind === 'people' ? existingPeople : websiteArticles) {
    if (existing.some(row => row.slug === article.slug)) continue;
    try { await save('cms_content', article); imported++; }
    catch (error) {
      if (error.message.includes('duplicate key')) continue;
      throw new Error(`${imported} imported before an error: ${error.message}. You can retry without duplicating records.`);
    }
  }
  return imported;
}
function write(db) { localStorage.setItem(key, JSON.stringify(db)); }
export async function list(table, filters = {}) {
  if (!supabase) return (read()[table] || []).filter(row => Object.entries(filters).every(([k, v]) => row[k] === v)).sort((a,b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
  let query = supabase.from(table).select('*').limit(1000);
  for (const [k, v] of Object.entries(filters)) query = query.eq(k, v);
  if (table !== 'cms_staff') query = query.order('created_at', { ascending: false });
  const { data, error } = await query;
  if (error) throw error;
  if (table === 'cms_media') return [...data, ...websiteMedia.filter(image => !data.some(row => row.url === image.url))];
  return data;
}
export async function save(table, value) {
  const record = structuredClone(value);
  const existingId = record.id;
  delete record.created_at; delete record.updated_at;
  if (!supabase) {
    const db = read(); const old = db[table].find(row => row.id === existingId);
    if (old && table === 'cms_content' && old.version !== record.version) throw new Error('This record changed. Reload before saving.');
    if (table === 'cms_content' && db[table].some(row => row.id !== record.id && row.kind === record.kind && row.slug === record.slug)) throw new Error('This URL slug is already in use.');
    record.id ||= crypto.randomUUID(); record.updated_at = new Date().toISOString();
    if (old) Object.assign(record, {...old,...record});
    record.created_at ||= record.updated_at;
    if (table === 'cms_content') { record.version = (old?.version || 0) + 1; db.cms_revisions.unshift({ id: crypto.randomUUID(), content_id: record.id, snapshot: record, created_at: record.updated_at }); }
    db[table] = [record, ...db[table].filter(row => row.id !== record.id)]; write(db); return record;
  }
  let query;
  if (existingId) {
    query = supabase.from(table).update(record).eq('id', existingId);
    if (table === 'cms_content') query = query.eq('version', record.version);
  } else { delete record.id; delete record.version; query = supabase.from(table).insert(record); }
  const { data, error } = await query.select().single();
  if (error) throw new Error(error.code === 'PGRST116' ? 'The record changed or access was denied. Reload and try again.' : error.message);
  return data;
}
export async function upload(file, alt) {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) throw new Error('Choose a JPEG, PNG, WebP or AVIF image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Images must be smaller than 5 MB.');
  if (!alt.trim()) throw new Error('Describe the image for accessibility.');
  if (!supabase) throw new Error('Media upload needs a connected Supabase project. Demo images remain available.');
  const path = `${crypto.randomUUID()}.${file.name.split('.').pop().toLowerCase()}`;
  const { error } = await supabase.storage.from('cms-media').upload(path, file, { cacheControl: '31536000', upsert: false });
  if (error) throw error;
  const url = supabase.storage.from('cms-media').getPublicUrl(path).data.publicUrl;
  try { return await save('cms_media', { name: file.name, alt, url, path, bytes: file.size }); }
  catch (error) { await supabase.storage.from('cms-media').remove([path]); throw error; }
}
export async function privateDownload(path) {
  if (!supabase) throw new Error('Connect Supabase to retrieve private documents.');
  const { data, error } = await supabase.storage.from('cms-private').createSignedUrl(path, 60);
  if (error) throw error;
  return data.signedUrl;
}

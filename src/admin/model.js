export const sectors = ['Group', 'Energy', 'Construction', 'Automobiles', 'Realty', 'Agriculture', 'Engineering'];
export const collections = {
  people: { title: 'People', singular: 'profile', group: 'Company', fields: [
    ['role', 'Position', 'text', true], ['displayName', 'Display name and credentials', 'text', true],
    ['group', 'Directory group', ['Leadership', 'Department Heads'], true],
    ['order', 'Display order', 'number', true], ['summary', 'Short biography', 'textarea', true],
    ['body', 'Biography', 'rich', true], ['linkedin', 'LinkedIn', 'url'],
    ['instagram', 'Instagram', 'url'], ['facebook', 'Facebook', 'url'],
    ['twitter', 'X / Twitter', 'url'], ['website', 'Website', 'url'],
  ] },
  articles: { title: 'Articles', singular: 'article', group: 'Publishing', fields: [
    ['summary', 'Excerpt', 'textarea', true], ['category', 'Category', ['News', 'Insights', 'Company updates', 'Business', 'Investment', 'Mobility', 'Energy'], true],
    ['author', 'Author', 'text', true], ['body', 'Article', 'rich', true], ['tags', 'Tags', 'text'],
    ['source_url', 'Source URL', 'url'], ['seo_title', 'SEO title', 'text'], ['seo_description', 'SEO description', 'textarea'],
  ] },
  jobs: { title: 'Jobs', singular: 'job', group: 'Recruitment', fields: [
    ['department', 'Department', 'text', true], ['location', 'Location', 'text', true],
    ['employment', 'Employment type', ['Full-time', 'Part-time', 'Contract', 'Internship'], true],
    ['workplace', 'Workplace', ['On-site', 'Hybrid', 'Remote'], true], ['salary', 'Salary range', 'text'],
    ['closing_date', 'Closing date', 'date', true], ['body', 'Job description', 'rich', true],
    ['requirements', 'Requirements', 'rich', true], ['benefits', 'Benefits', 'textarea'],
    ['application_url', 'Application URL', 'url'],
  ] },
  courses: { title: 'Training', singular: 'programme', group: 'Academy', fields: [
    ['summary', 'Overview', 'textarea', true], ['instructor', 'Instructor', 'text', true],
    ['delivery', 'Delivery', ['In person', 'Online', 'Hybrid'], true], ['location', 'Location / platform', 'text', true],
    ['start_date', 'Start date', 'date', true], ['duration', 'Duration', 'text', true],
    ['capacity', 'Available places', 'number', true], ['fee', 'Fee (NGN)', 'number', true],
    ['body', 'Curriculum', 'rich', true], ['requirements', 'Entry requirements', 'textarea'],
    ['enrollment_url', 'Enrolment URL', 'url'],
  ] },
};
export const stages = {
  applications: ['received', 'reviewing', 'shortlisted', 'interview', 'offer', 'hired', 'rejected'],
  enrollments: ['received', 'reviewing', 'accepted', 'waitlisted', 'completed', 'cancelled'],
};
export const allowed = (role, kind) => role === 'admin' || ({ editor: ['articles', 'media'], recruiter: ['jobs', 'applications'], trainer: ['courses', 'enrollments', 'media'] }[role] || []).includes(kind);
export const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export function validateRecord(record, publish = false) {
  if (!record.title?.trim()) return 'A title is required.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug || '')) return 'Use a URL slug with lowercase letters, numbers and hyphens.';
  if (publish) {
    for (const [key, label, type, required] of collections[record.kind].fields) {
      const value = record.data[key];
      if (required && (value === '' || value == null || (type === 'rich' && !String(value).replace(/<[^>]*>/g, '').trim()))) return `${label} is required to publish.`;
    }
    if (record.kind === 'articles' && !record.image_url) return 'Select a cover image before publishing.';
    if (!record.published_at) return 'Set a publication date.';
  }
  for (const [key, label, type] of collections[record.kind].fields) {
    const value = record.data[key];
    if (type === 'number' && value !== '' && value != null && (!Number.isFinite(Number(value)) || Number(value) < 0)) return `${label} must be a non-negative number.`;
    if (type === 'url' && value && !/^https:\/\//i.test(value)) return `${label} must start with https://.`;
  }
  return '';
}

import { profiles } from '../data/people';
import { leaders } from '../content';
import { slugify } from './model';

export const existingPeople = leaders.map((person,index) => ({
  kind:'people', title:person.name, slug:slugify(person.name), sector:'Group',
  status:'published', published_at:'2026-10-26T00:00:00.000Z', image_url:person.image, image_alt:person.name,
  data:{role:person.role, displayName:profiles[index].displayName,
    group:index===0?'Leadership':'Department Heads', order:index, summary:person.bio,
    body:profiles[index].paragraphs.map(paragraph=>`<p>${paragraph}</p>`).join(''),
    founder:index===0,
  },
}));

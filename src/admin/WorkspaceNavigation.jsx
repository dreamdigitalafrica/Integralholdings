import {useEffect, useState} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {Bell, CalendarDays, ChevronDown, Inbox, Search, X} from 'lucide-react';
import * as api from './api';
import {allowed, collections} from './model';

export function NavigationGroup({group,items,section,onNavigate}) {
 const [closed,setClosed]=useState(()=>localStorage.getItem(`cms-group-${group}`)==='closed');
 const id=`cms-group-${group.toLowerCase().replaceAll(' ','-')}`;
 return <div className={`cms-nav-group ${closed?'is-folded':''}`}><button className="cms-group-toggle" aria-expanded={!closed} aria-controls={id} onClick={()=>setClosed(value=>{localStorage.setItem(`cms-group-${group}`,value?'open':'closed');return !value;})}><span>{group}</span><ChevronDown size={16}/></button><div className="cms-group-links" id={id}>{items.map(([key,label,Icon])=><NavLink key={key} to={`/admin/${key}`} title={label} aria-label={label} className={section===key?'active':''} onClick={onNavigate}><Icon size={20}/><span className="cms-nav-label">{label}</span></NavLink>)}</div></div>;
}

export function HeaderTools({profile,modules}) {
 const [query,setQuery]=useState(''),[open,setOpen]=useState(false),[rows,setRows]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 useEffect(()=>{
  if(!open)return;
  let active=true;setLoading(true);setError('');
  api.list('cms_content').then(data=>{if(active)setRows(data);}).catch(()=>{if(active)setError('Content search unavailable. Module shortcuts are still available.');}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[open]);
 const term=query.trim().toLowerCase();
 const results=[...modules.map(([key,label])=>({label,path:`/admin/${key}`,type:'Module'})),...rows.filter(r=>allowed(profile.role,r.kind)&&collections[r.kind]).map(r=>({label:r.title,path:`/admin/${r.kind}/${r.id}`,type:collections[r.kind].title}))].filter(r=>!term||r.label.toLowerCase().includes(term)).slice(0,10);
 return <div className="cms-header-tools"><div className="cms-header-search" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}}><Search size={18}/><input aria-label="Search workspace" placeholder="Search workspace" type="search" value={query} onFocus={()=>setOpen(true)} onChange={e=>{setQuery(e.target.value);setOpen(true);}}/>{query&&<button title="Clear search" aria-label="Clear search" onClick={()=>setQuery('')}><X size={15}/></button>}{open&&<div className="cms-header-results" aria-label="Search results">{loading&&<p role="status">Searching content...</p>}{error&&<p role="alert">{error}</p>}{results.map(r=><Link key={r.path} to={r.path} onClick={()=>{setOpen(false);setQuery('');}}><span>{r.label}</span><small>{r.type}</small></Link>)}{!loading&&!results.length&&<p>No results found.</p>}</div>}</div><div className="cms-header-shortcuts">{[['calendar','Calendar',CalendarDays],['notifications','Notifications',Bell],['inquiries','Inquiries',Inbox]].filter(([key])=>allowed(profile.role,key)).map(([key,label,Icon])=><Link key={key} to={`/admin/${key}`} title={label} aria-label={`${label} shortcut`}><Icon size={20}/></Link>)}</div></div>;
}

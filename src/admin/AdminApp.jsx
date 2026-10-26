import { useEffect, useState, useCallback } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, FileText, BriefcaseBusiness, GraduationCap, Users, Image, LogOut, Search, Plus, ChevronLeft, ChevronRight, ExternalLink, Menu, X, Save, Eye, History, Upload, Download, Check, ShieldCheck, Settings2, LoaderCircle } from 'lucide-react';
import DOMPurify from 'dompurify';
import { supabase, configured } from './client';
import { collections, sectors, allowed, stages, slugify, validateRecord } from './model';
import * as api from './api';
import RichEditor from './RichEditor';
import Communications from './Communications';
import {HeaderTools, NavigationGroup} from './WorkspaceNavigation';
import {CalendarDays, Bell, Inbox} from 'lucide-react';
import './admin.css';
import './workspace.css';
import './clivax.css';
import './light.css';
import './communications.css';
import './navigation.css';

const nav = [
  ['Workspace', [['overview','Overview',LayoutDashboard],['calendar','Calendar',CalendarDays],['notifications','Notifications',Bell],['inquiries','Inquiries',Inbox]]],
  ['Publishing', [['articles','Articles',FileText], ['media','Media library',Image]]],
  ['Recruitment', [['jobs','Jobs',BriefcaseBusiness], ['applications','Applications',Users]]],
  ['Academy', [['courses','Training',GraduationCap], ['enrollments','Enrolments',Users]]],
  ['Company', [['people','People',Users]]],
  ['Administration', [['team','Team & access',ShieldCheck], ['settings','Settings',Settings2]]],
];
const titles = { calendar:'Calendar', notifications:'Notifications', inquiries:'Inquiries', overview: 'Overview', media: 'Media library', applications: 'Applications', enrollments: 'Enrolments', team: 'Team & access', settings: 'Settings', ...Object.fromEntries(Object.entries(collections).map(([k,v]) => [k,v.title])) };
const date = value => value ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set';
const status = record => record.status === 'published' && new Date(record.published_at) > new Date() ? 'scheduled' : record.status;
function Badge({ children }) { return <span className={`cms-badge ${children}`}>{children}</span>; }
function Empty({ title, text, children }) { return <div className="cms-empty"><FileText size={28} /><h3>{title}</h3>{text && <p>{text}</p>}{children}</div>; }

function Login({ onDemo }) {
  const [error,setError] = useState(''); const [busy,setBusy] = useState(false); const [sent,setSent] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    const data = new FormData(event.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({ email: data.get('email'), password: data.get('password') });
    if (error) setError(error.message); setBusy(false);
  }
  async function reset(event) {
    const email = event.currentTarget.form.elements.email.value;
    if (!email) { setError('Enter your email address first.'); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin/settings` });
    if (error) setError(error.message); else setSent(true);
  }
  return <div className="cms-root cms-login"><div className="cms-login-box"><img src="/integral/integral-favicon-blue.png" alt="" width="36" height="36" /><h1>Integral workspace</h1><p>Sign in to manage your content.</p>{configured ? <form onSubmit={submit}><label>Email address<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p role="alert" className="cms-error">{error}</p>}{sent && <p role="status">Password reset instructions requested. Check your email.</p>}<button className="cms-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button><button type="button" className="cms-text-button" onClick={reset}>Forgot password?</button></form> : <><p className="cms-notice">Supabase is not connected. The demo uses sample data saved only in this browser.</p><button className="cms-primary" onClick={onDemo}>Explore local demo</button></>}<Link to="/">Back to website</Link></div></div>;
}

export default function AdminApp() {
  const { '*': path = '' } = useParams(); const [rawSection, id] = path.split('/'); const section = rawSection || 'overview';
  const [user,setUser] = useState(null); const [profile,setProfile] = useState(null); const [authLoading,setAuthLoading] = useState(configured);
  const [collapsed,setCollapsed] = useState(()=>localStorage.getItem('cms-sidebar-collapsed')==='true');
  const toggleSidebar=()=>setCollapsed(value=>{localStorage.setItem('cms-sidebar-collapsed',String(!value));return !value;});
  const [authError,setAuthError] = useState(''); const [menu,setMenu] = useState(false); const [recovery,setRecovery] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    async function load(session) {
      if (!active) return;
      setUser(session?.user || null); setProfile(null);
      if (session?.user) {
        const { data, error } = await supabase.from('cms_staff').select('*').eq('id',session.user.id).eq('active',true).maybeSingle();
        if (active) { setProfile(data); setAuthError(error?.message || (!data ? 'Your account has not been granted workspace access.' : '')); }
      }
      if (active) setAuthLoading(false);
    }
    supabase.auth.getSession().then(({data}) => load(data.session));
    const { data } = supabase.auth.onAuthStateChange((event,session) => {
      if (event === 'PASSWORD_RECOVERY') { setRecovery(true); navigate('/admin/settings'); }
      setTimeout(() => load(session), 0);
    });
    return () => { active=false; data.subscription.unsubscribe(); };
  }, [navigate]);
  async function logout() {
    if (supabase) { const {error} = await supabase.auth.signOut(); if (error) { setAuthError(error.message); return; } }
    setProfile(null); setUser(null); navigate('/admin');
  }
  if (authLoading) return <div className="cms-root cms-loading"><LoaderCircle className="cms-spin" /> Loading workspace</div>;
  if (!user) return <Login onDemo={() => { setUser({ id: 'demo' }); setProfile({ id: 'demo', name: 'Local administrator', role: 'admin' }); }} />;
  if (!profile) return <div className="cms-root cms-login"><div className="cms-login-box"><h1>Access required</h1><p role="alert">{authError}</p><button onClick={logout}>Sign out</button></div></div>;
  const canSee = key => ['overview','settings'].includes(key) || (key === 'team' ? profile.role === 'admin' : allowed(profile.role,key));
  return <div className={`cms-root cms-app ${collapsed?'cms-collapsed':''}`}><aside className={`cms-sidebar ${menu ? 'is-open' : ''}`}><Link to="/admin" className="cms-brand"><img className="cms-logo-full" src="/integral/integral-logo-supplied.png" alt="Integral" /><img className="cms-logo-mark" src="/integral/integral-favicon-blue.png" alt="Integral" /></Link><button className="cms-mobile-close" title="Close navigation" onClick={() => setMenu(false)}><X size={20} /></button><nav>{nav.map(([group,items]) => { const visible=items.filter(([key]) => canSee(key)); return visible.length ? <NavigationGroup key={group} group={group} items={visible} section={section} onNavigate={()=>setMenu(false)}/> : null; })}</nav><div className="cms-sidebar-bottom"><a href="/" target="_blank" rel="noreferrer"><ExternalLink size={18}/><span className="cms-nav-label">View website</span></a><div className="cms-user"><span>{profile.name?.slice(0,1)}</span><div><strong>{profile.name}</strong><small>{profile.role}</small></div><button title="Sign out" aria-label="Sign out" onClick={logout}><LogOut size={18}/></button></div></div></aside><div className="cms-workspace"><header className="cms-topbar"><button className="cms-collapse-toggle" aria-label={collapsed?'Expand sidebar':'Collapse sidebar'} title={collapsed?'Expand sidebar':'Collapse sidebar'} aria-expanded={!collapsed} onClick={toggleSidebar}>{collapsed?<ChevronRight size={21}/>:<ChevronLeft size={21}/>}</button><button className="cms-mobile-menu" title="Open navigation" onClick={() => setMenu(true)}><Menu size={20}/></button><span>{titles[section] || 'Overview'}</span><HeaderTools profile={profile} modules={nav.flatMap(([,items])=>items).filter(([key])=>canSee(key))}/><Link className="cms-account-link" to="/admin/settings" title="Account settings"><span>{profile.name?.slice(0,1)}</span><strong>{profile.name}</strong></Link></header>{!configured && <div className="cms-demo-banner">Demo mode · Changes stay in this browser.</div>}<main className="cms-main">{authError && <p role="alert" className="cms-error">{authError}</p>}{!canSee(section) ? <Empty title="Access restricted"/> : <Workspace key={`${section}/${id || ''}`} section={section} id={id} profile={profile} recovery={recovery} onRecovered={() => setRecovery(false)}/>}</main></div></div>;
}

function Workspace({section,id,profile,recovery,onRecovered}) {
  const [rows,setRows] = useState([]); const [error,setError] = useState(''); const [loading,setLoading] = useState(true);
  const table = collections[section] ? 'cms_content' : stages[section] ? 'cms_submissions' : section === 'media' ? 'cms_media' : section === 'team' ? 'cms_staff' : 'cms_content';
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setRows(await api.list(table, collections[section] || stages[section] ? {kind:section} : {})); } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  },[table,section]);
  useEffect(() => { load(); },[load]);
  if (section === 'settings') return <Settings recovery={recovery} onRecovered={onRecovered}/>;
  if (['calendar','notifications','inquiries'].includes(section)) return <Communications section={section}/>;
  if (loading) return <div className="cms-loading"><LoaderCircle className="cms-spin"/> Loading content</div>;
  if (error) return <div className="cms-error" role="alert">{error}<button onClick={load}>Retry</button></div>;
  if (section === 'overview' || !titles[section]) return <Overview rows={rows} profile={profile}/>;
  if (section === 'media') return <Media rows={rows} onRefresh={load}/>;
  if (section === 'team') return <Team rows={rows} profile={profile} onRefresh={load}/>;
  if (id) {
    const record = rows.find(row=>row.id === id);
    if (id !== 'new' && !record) return <Empty title="Record not found" text="It may have moved or your permissions may have changed."/>;
    return collections[section] ? <ContentEditor kind={section} record={record}/> : <SubmissionEditor kind={section} record={record}/>;
  }
  return <Records rows={rows} section={section} onRefresh={load}/>;
}

function Overview({rows,profile}) {
  const recent = [...rows].sort((a,b)=>b.updated_at.localeCompare(a.updated_at)).slice(0,6);
  return <><div className="cms-page-heading"><div><span className="cms-eyebrow">Dashboard</span><h1>Overview</h1><p></p></div><span className="cms-today">{date(new Date())}</span></div><div className="cms-stats">{[['Total content',rows.length],['Published',rows.filter(r=>status(r)==='published').length],['Drafts',rows.filter(r=>r.status==='draft').length],['Scheduled',rows.filter(r=>status(r)==='scheduled').length]].map(([label,value],index)=><div key={label}><span className={'cms-stat-icon tone-'+index}>{index===0?<FileText/>:index===1?<Check/>:index===2?<FileText/>:<History/>}</span><div><span>{label}</span><strong>{String(value).padStart(2,'0')}</strong></div></div>)}</div><section className="cms-section"><div className="cms-section-title"><h2>Collections</h2><span>Manage your website</span></div><div className="cms-collection-grid">{Object.entries(collections).filter(([key])=>allowed(profile.role,key)).map(([key,config])=><Link key={key} className="cms-collection" to={`/admin/${key}`}><div><span className={`cms-collection-icon ${key}`}>{key==='people'?<Users/>:key==='articles'?<FileText/>:key==='jobs'?<BriefcaseBusiness/>:<GraduationCap/>}</span><span>{rows.filter(r=>r.kind===key).length} records</span></div><h3>{config.title}</h3><p>{key==='people'?'Biographies and social profiles':key==='articles'?'News and articles':key==='jobs'?'Open roles and recruitment content':'Programmes, courses and academy content'}</p><span className="cms-collection-action">Manage {config.title.toLowerCase()} <ChevronRight size={16}/></span></Link>)}</div></section><PublishingSummary rows={rows}/><section className="cms-section"><div className="cms-section-title"><h2>Recently updated</h2><span>{recent.length} records</span></div>{recent.length ? <div className="cms-table-wrap"><table><thead><tr><th>Title</th><th>Collection</th><th>Status</th><th>Updated</th></tr></thead><tbody>{recent.map(r=><tr key={r.id}><td><Link to={`/admin/${r.kind}/${r.id}`}>{r.title}</Link></td><td>{collections[r.kind].title}</td><td><Badge>{status(r)}</Badge></td><td>{date(r.updated_at)}</td></tr>)}</tbody></table></div> : <Empty title="No content yet"/>}</section></>;
}


function PublishingSummary({rows}) {
  const states = ['published','draft','scheduled','archived'];
  return <section className="cms-publishing-summary" aria-label="Publishing status">
    <div><h2>Publishing status</h2><p>{rows.length} records in your accessible collections</p></div>
    <div className="cms-status-breakdown">{states.map(state=>{
      const count=rows.filter(row=>status(row)===state).length;
      return <div key={state}><div><Badge>{state}</Badge><strong>{count}</strong></div><progress aria-label={state} value={count} max={Math.max(rows.length,1)}/></div>;
    })}</div>
  </section>;
}

function Records({rows,section,onRefresh}) {
  const [importing,setImporting]=useState(false);
  const [importError,setImportError]=useState('');
  async function importWebsite() {
    setImporting(true);setImportError('');
    try { await api.importWebsiteArticles(section); await onRefresh(); }
    catch(error) {setImportError(error.message);}
    finally {setImporting(false);}
  }
  const [query,setQuery]=useState(''); const [filter,setFilter]=useState('all'); const [page,setPage]=useState(1); const [sort,setSort]=useState('updated');
  const isContent=Boolean(collections[section]);
  const filtered=rows.filter(r=>`${r.title||r.name} ${r.email||''} ${r.sector||''}`.toLowerCase().includes(query.toLowerCase()) && (filter==='all'||(isContent?status(r):r.stage)===filter)).sort((a,b)=>sort==='title'?(a.title||a.name).localeCompare(b.title||b.name):(b.updated_at||'').localeCompare(a.updated_at||''));
  const [pageSize,setPageSize]=useState(10);
  const pages=Math.max(1,Math.ceil(filtered.length/pageSize)); const current=Math.min(page,pages);
  return <><div className="cms-page-heading"><div><span className="cms-eyebrow">{isContent?collections[section].group:'PEOPLE'}</span><h1>{titles[section]} <span className="cms-count">{rows.length}</span></h1></div><Link className="cms-primary" to={`/admin/${section}/new`}><Plus size={17}/>Create {isContent?collections[section].singular:'record'}</Link></div>{['articles','people'].includes(section)&&configured&&<div className="cms-import-bar"><span>{section==='people'?'Existing team profiles':'Existing website articles'}</span><button disabled={importing} onClick={importWebsite}><Download size={16}/>{importing?'Importing…':'Import from website'}</button></div>}{importError&&<p role="alert" className="cms-error">{importError}</p>}<div className="cms-toolbar"><label className="cms-search"><Search size={17}/><input aria-label="Search records" placeholder={`Search ${titles[section].toLowerCase()}…`} value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}}/></label><select aria-label="Filter status" value={filter} onChange={e=>{setFilter(e.target.value);setPage(1);}}><option value="all">All statuses</option>{(isContent?['draft','published','scheduled','archived']:stages[section]).map(v=><option key={v}>{v}</option>)}</select><select aria-label="Sort records" value={sort} onChange={e=>setSort(e.target.value)}><option value="updated">Recently updated</option><option value="title">Alphabetical</option></select></div>{filtered.length ? <div className="cms-table-wrap"><table><thead><tr><th>{isContent?'Title':'Name'}</th><th>{isContent?'Sector':'Email'}</th><th>Status</th><th>Updated</th><th aria-label="Open"/></tr></thead><tbody>{filtered.slice((current-1)*pageSize,current*pageSize).map(r=><tr key={r.id}><td><Link to={`/admin/${section}/${r.id}`}>{r.title||r.name}</Link><small>{r.slug||r.phone}</small></td><td>{r.sector||r.email}</td><td><Badge>{isContent?status(r):r.stage}</Badge></td><td>{date(r.updated_at)}</td><td><Link aria-label={`Edit ${r.title||r.name}`} to={`/admin/${section}/${r.id}`}><ChevronRight size={17}/></Link></td></tr>)}</tbody></table></div>:<Empty title="No matching records" text="Create a record or change your search and filters."/>}<div className="cms-pagination"><label className="cms-page-size">Rows per page<select aria-label="Rows per page" value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1);}}>{[10,25,50].map(size=><option key={size} value={size}>{size}</option>)}</select><span>{filtered.length ? (current-1)*pageSize+1 : 0}-{Math.min(current*pageSize,filtered.length)} of {filtered.length}</span></label><div><button title="Previous page" disabled={current===1} onClick={()=>setPage(current-1)}><ChevronLeft size={16}/></button><span>{current} / {pages}</span><button title="Next page" disabled={current===pages} onClick={()=>setPage(current+1)}><ChevronRight size={16}/></button></div></div></>;
}

function ContentEditor({kind,record}) {
  const navigate=useNavigate();
  const [value,setValue]=useState(()=>record || {kind,title:'',slug:'',sector:kind==='courses'?'Agriculture':'Group',status:'draft',published_at:new Date().toISOString(),image_url:'',image_alt:'',data:{}});
  const [slugEdited,setSlugEdited]=useState(Boolean(record));
  const [dirty,setDirty]=useState(false); const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [message,setMessage]=useState(''); const [preview,setPreview]=useState(false); const [history,setHistory]=useState(null); const [media,setMedia]=useState(null);
  const update=(patch)=>{setValue(v=>({...v,...patch}));setDirty(true);setMessage('');};
  const updateData=(key,v)=>update({data:{...value.data,[key]:v}});
  useEffect(()=>{ const guard=e=>{if(dirty){e.preventDefault();e.returnValue='';}}; window.addEventListener('beforeunload',guard); return()=>window.removeEventListener('beforeunload',guard); },[dirty]);
  useEffect(()=>{
    const guard=e=>{const link=e.target.closest('a');if(dirty&&link&&link.origin===window.location.origin&&link.pathname!==window.location.pathname&&!window.confirm('Leave without saving your changes?')) {e.preventDefault();e.stopPropagation();}};
    document.addEventListener('click',guard,true);return()=>document.removeEventListener('click',guard,true);
  },[dirty]);
  async function persist(nextStatus) {
    const next={...value,status:nextStatus}; const invalid=validateRecord(next,nextStatus==='published');
    if(invalid){setError(invalid);return;} setBusy(true);setError('');
    try {const saved=await api.save('cms_content',next);setValue(saved);setDirty(false);setMessage('Changes saved.');if(!record)navigate(`/admin/${kind}/${saved.id}`,{replace:true});}catch(e){setError(e.message);}finally{setBusy(false);}
  }
  async function revisions(){try{setHistory(await api.list('cms_revisions',{content_id:value.id}));}catch(e){setError(e.message);}}
  async function images(){try{setMedia(await api.list('cms_media'));}catch(e){setError(e.message);}}
  return <><Link className="cms-back" to={`/admin/${kind}`}><ChevronLeft size={16}/>{collections[kind].title}</Link><div className="cms-editor-heading"><div><h1>{record?'Edit':'Create'} {collections[kind].singular}</h1><span className="cms-muted">{dirty?'Unsaved changes':value.updated_at?`Last updated ${date(value.updated_at)}`:'New record'}</span></div><div className="cms-actions"><button title="Preview" onClick={()=>setPreview(true)}><Eye size={17}/>Preview</button>{value.id&&<button title="Revision history" onClick={revisions}><History size={17}/></button>}<button onClick={()=>persist('draft')} disabled={busy}><Save size={16}/>Save draft</button><button className="cms-primary" onClick={()=>persist('published')} disabled={busy}>{busy?<LoaderCircle size={16} className="cms-spin"/>:<Check size={16}/>}Publish</button></div></div>{error&&<p className="cms-error" role="alert">{error}</p>}{message&&<p className="cms-success" role="status">{message}</p>}<div className="cms-editor-layout"><div className="cms-editor-fields"><label>{kind==='people'?'Full name':'Title'} <span>*</span><input value={value.title} onChange={e=>update({title:e.target.value,...(!slugEdited?{slug:slugify(e.target.value)}:{})})} onBlur={()=>{if(!value.slug)update({slug:slugify(value.title)});}} maxLength={240}/></label>{collections[kind].fields.map(([key,label,type,required])=><Field key={key} name={label} type={type} required={required} value={value.data[key]??''} onChange={v=>updateData(key,v)}/>)}</div><aside className="cms-editor-sidebar"><section><h2>Publication</h2><Badge>{status(value)}</Badge><label>URL slug<input value={value.slug} onChange={e=>{setSlugEdited(true);update({slug:e.target.value});}}/></label><label>Sector<select value={value.sector} onChange={e=>update({sector:e.target.value})}>{sectors.map(s=><option key={s}>{s}</option>)}</select></label><label>Publish date<input type="datetime-local" value={value.published_at?new Date(new Date(value.published_at).getTime()-new Date(value.published_at).getTimezoneOffset()*60000).toISOString().slice(0,16):''} onChange={e=>update({published_at:e.target.value?new Date(e.target.value).toISOString():null})}/></label>{value.id&&<button className="cms-danger-text" onClick={()=>{if(confirm('Archive this record? It will no longer be publicly available.'))persist('archived');}} disabled={busy}>Archive record</button>}</section><section><h2>{kind==='people'?'Portrait':'Cover image'}</h2>{value.image_url?<img className="cms-cover" src={value.image_url} alt={value.image_alt||''}/>:<div className="cms-cover-empty"><Image size={24}/></div>}<button onClick={images}><Image size={16}/>Choose image</button><label>Alternative text<input value={value.image_alt||''} onChange={e=>update({image_alt:e.target.value})}/></label>{value.image_url&&<button className="cms-text-button" onClick={()=>update({image_url:'',image_alt:''})}>Remove image</button>}</section></aside></div>{preview&&<Modal title="Content preview" close={()=>setPreview(false)}><article className="cms-preview">{value.image_url&&<img src={value.image_url} alt={value.image_alt||''}/>}<small>{value.sector}</small><h1>{value.title}</h1><p>{value.data.summary}</p><div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(value.data.body||'')}}/></article></Modal>}{history&&<Modal title="Revision history" close={()=>setHistory(null)}>{history.length?history.map(r=><div className="cms-revision" key={r.id}><div><strong>Version {r.snapshot.version}</strong><span>{date(r.created_at)} · {r.snapshot.status}</span></div><button onClick={()=>{if(confirm('Restore this revision as an unsaved draft?')){update({...r.snapshot,id:value.id,version:value.version,status:'draft'});setHistory(null);}}}>Restore draft</button></div>):<Empty title="No revisions yet"/>}</Modal>}{media&&<Modal title="Choose cover image" close={()=>setMedia(null)}><div className="cms-media-grid">{media.map(m=><button key={m.id} onClick={()=>{update({image_url:m.url,image_alt:m.alt});setMedia(null);}}><img src={m.url} alt={m.alt}/><span>{m.name}</span></button>)}</div>{!media.length&&<Empty title="Your media library is empty" text="Upload images in Media library before selecting a cover."/>}</Modal>}</>;
}

function Field({name,type,value,onChange,required}) {
  return <label>{name}{required&&<span> *</span>}{Array.isArray(type)?<select value={value} onChange={e=>onChange(e.target.value)}><option value="">Select…</option>{type.map(v=><option key={v}>{v}</option>)}</select>:type==='rich'?<RichEditor label={name} value={value} onChange={onChange}/>:type==='textarea'?<textarea rows={4} value={value} onChange={e=>onChange(e.target.value)}/>:<input type={type} min={type==='number'?0:undefined} value={value} onChange={e=>onChange(e.target.value)}/>}</label>;
}
function Modal({title,close,children}) {
  useEffect(()=>{const handler=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',handler);return()=>document.removeEventListener('keydown',handler);},[close]);
  return <div className="cms-modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)close();}}><section className="cms-modal" role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><button autoFocus aria-label="Close dialog" onClick={close}><X size={20}/></button></header>{children}</section></div>;
}

function SubmissionEditor({kind,record}) {
  const navigate=useNavigate();const [value,setValue]=useState(record||{kind,name:'',email:'',phone:'',content_id:'',stage:'received',notes:'',consent_at:'',retain_until:''});const [options,setOptions]=useState([]);const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
  useEffect(()=>{api.list('cms_content',{kind:kind==='applications'?'jobs':'courses'}).then(setOptions).catch(e=>setError(e.message));},[kind]);
  async function submit(e){e.preventDefault();setBusy(true);setError('');try{const saved=await api.save('cms_submissions',value);setValue(saved);setMessage('Record saved.');if(!record)navigate(`/admin/${kind}/${saved.id}`,{replace:true});}catch(e){setError(e.message);}finally{setBusy(false);}}
  return <><Link className="cms-back" to={`/admin/${kind}`}><ChevronLeft size={16}/>{titles[kind]}</Link><div className="cms-page-heading"><h1>{record?value.name:'New record'}</h1><Badge>{value.stage}</Badge></div><form onSubmit={submit} className="cms-record-form">{error&&<p role="alert" className="cms-error">{error}</p>}{message&&<p role="status" className="cms-success">{message}</p>}<div className="cms-form-grid">{[['name','Full name','text'],['email','Email','email'],['phone','Phone','tel']].map(([key,label,type])=><label key={key}>{label}<input type={type} required={key!=='phone'} value={value[key]||''} onChange={e=>setValue({...value,[key]:e.target.value})}/></label>)}<label>{kind==='applications'?'Job':'Programme'}<select required value={value.content_id} onChange={e=>setValue({...value,content_id:e.target.value})}><option value="">Select…</option>{options.map(o=><option value={o.id} key={o.id}>{o.title}</option>)}</select></label><label>Stage<select value={value.stage} onChange={e=>setValue({...value,stage:e.target.value})}>{stages[kind].map(s=><option key={s}>{s}</option>)}</select></label><label>Consent recorded<input type="datetime-local" required value={value.consent_at?.slice(0,16)||''} onChange={e=>setValue({...value,consent_at:e.target.value?new Date(e.target.value).toISOString():''})}/></label><label>Retain until<input type="date" required value={value.retain_until||''} onChange={e=>setValue({...value,retain_until:e.target.value})}/></label></div><label>Internal notes<textarea rows={6} value={value.notes} onChange={e=>setValue({...value,notes:e.target.value})}/></label>{value.document_path&&<button type="button" onClick={async()=>{try{const url=await api.privateDownload(value.document_path);window.open(url,'_blank','noopener,noreferrer');}catch(e){setError(e.message);}}}><Download size={16}/>View private document</button>}<button className="cms-primary" disabled={busy}><Save size={16}/>{busy?'Saving…':'Save record'}</button></form></>;
}

function Media({rows,onRefresh}) {
  const [alt,setAlt]=useState('');const [file,setFile]=useState(null);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  async function upload(e){e.preventDefault();setBusy(true);setError('');try{await api.upload(file,alt);setAlt('');setFile(null);e.target.reset();await onRefresh();}catch(e){setError(e.message);}finally{setBusy(false);}}
  return <><div className="cms-page-heading"><div><span className="cms-eyebrow">PUBLISHING</span><h1>Media library</h1><p>Public website imagery. Private documents belong in applicant records.</p></div></div><form className="cms-upload" onSubmit={upload}><label>Image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" required onChange={e=>setFile(e.target.files[0])}/></label><label>Alternative text<input value={alt} required onChange={e=>setAlt(e.target.value)}/></label><button className="cms-primary" disabled={busy||!file}><Upload size={16}/>{busy?'Uploading…':'Upload image'}</button></form>{error&&<p role="alert" className="cms-error">{error}</p>}<div className="cms-media-grid">{rows.map(m=><article key={m.id}><img src={m.url} alt={m.alt} loading="lazy"/><strong>{m.name}</strong><p>{m.alt}</p><small>{Math.round(m.bytes/1024)} KB</small></article>)}</div>{!rows.length&&<Empty title="No uploaded images" text="JPEG, PNG, WebP and AVIF · Up to 5 MB per image"/>}</>;
}

function Team({rows,profile,onRefresh}) {
  const [error,setError]=useState('');const [busy,setBusy]=useState(false);
  async function change(row,patch){if(!confirm('Update this team member’s access?'))return;setBusy(true);try{await api.save('cms_staff',{...row,...patch});await onRefresh();}catch(e){setError(e.message);}finally{setBusy(false);}}
  return <><div className="cms-page-heading"><div><span className="cms-eyebrow">ADMINISTRATION</span><h1>Team &amp; access</h1><p>Administrators manage access. Editors, recruiters and trainers have separate permissions.</p></div></div>{error&&<p className="cms-error" role="alert">{error}</p>}<div className="cms-table-wrap"><table><thead><tr><th>Name</th><th>Role</th><th>Access</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.name}{r.id===profile.id&&<small>You</small>}</td><td><select aria-label={`Role for ${r.name}`} disabled={busy||r.id===profile.id} value={r.role} onChange={e=>change(r,{role:e.target.value})}>{['admin','editor','recruiter','trainer'].map(v=><option key={v}>{v}</option>)}</select></td><td><label className="cms-inline"><input type="checkbox" checked={r.active} disabled={busy||r.id===profile.id} onChange={e=>change(r,{active:e.target.checked})}/>Active</label></td></tr>)}</tbody></table></div><p className="cms-notice">New staff invitations are issued through Supabase Auth, then assigned a role in the staff table. Public self-registration does not grant dashboard access.</p></>;
}
function Settings({recovery,onRecovered}) {
  const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
  async function update(e){e.preventDefault();if(!supabase){setMessage('Password changes require Supabase.');return;}const data=new FormData(e.target);if(data.get('password')!==data.get('confirm')){setMessage('Passwords do not match.');return;}setBusy(true);const {error}=await supabase.auth.updateUser({password:data.get('password')});setMessage(error?.message||'Password updated.');setBusy(false);if(!error){e.target.reset();onRecovered();}}
  return <><div className="cms-page-heading"><div><h1>{recovery?'Reset your password':'Settings'}</h1><p>Workspace connection and account security.</p></div></div><section className="cms-settings"><h2>Connection</h2><dl><dt>Database</dt><dd>{configured?'Supabase':'Not configured'}</dd><dt>Environment</dt><dd>{configured?'Connected project':'Local demo'}</dd><dt>Website</dt><dd><a href="/">Integral Holdings</a></dd></dl><h2>Change password</h2><form onSubmit={update}><label>New password<input name="password" type="password" autoComplete="new-password" minLength={12} required/></label><label>Confirm password<input name="confirm" type="password" autoComplete="new-password" minLength={12} required/></label><button disabled={busy} className="cms-primary">Update password</button>{message&&<p role="status">{message}</p>}</form></section></>;
}

import nodemailer from 'nodemailer';

const recipient = 'support@integralholdings.co';
const sectors = ['Group','Energy','Construction','Automobiles','Realty','Agriculture','Engineering'];
export function createHandler({env = process.env, fetcher = fetch, createTransport = nodemailer.createTransport, logger = console} = {}) {
 return async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {res.setHeader('Allow','POST');return res.status(405).json({message:'Method not allowed.'});}
  if (!String(req.headers['content-type'] || '').includes('application/json')) return res.status(415).json({message:'Send JSON.'});
  let body;
  try {body=typeof req.body==='string'?JSON.parse(req.body):req.body;} catch {return res.status(400).json({message:'Invalid message.'});}
  if (!body || Array.isArray(body) || typeof body!=='object') return res.status(400).json({message:'Invalid message.'});
  const data={};
  for (const [key,max] of Object.entries({name:120,email:254,phone:40,sector:30,subject:200,message:10000})) {
   const value=body[key] ?? (key==='sector'?'Group':key==='subject'?'Website inquiry':'');
   if(typeof value!=='string'||value.length>max) return res.status(400).json({message:'Please check your contact details and message.'});
   data[key]=value.trim();
  }
  if(!data.name || !data.message || !data.subject || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !sectors.includes(data.sector) || /[\r\n]/.test(data.name+data.subject)) return res.status(400).json({message:'Please check your contact details and message.'});
  const url=env.VITE_SUPABASE_URL,key=env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) return res.status(503).json({message:'Messaging is temporarily unavailable. Please email support@integralholdings.co.'});
  try {
   const response=await fetcher(`${url}/rest/v1/cms_inquiries`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(data),signal:AbortSignal.timeout(10000)});
   if(!response.ok){const result=await response.json().catch(()=>({}));const limited=String(result.message).includes('Too many');return res.status(limited?429:503).json({message:limited?'Too many messages. Please try again later.':'We could not save your message. Please email support@integralholdings.co.'});}
  } catch {return res.status(503).json({message:'Delivery could not be confirmed. Please contact support@integralholdings.co before sending again.'});}
  // The database intake trigger limits volume before any email is sent.
  let transport;
  try {
   const port=Number(env.SMTP_PORT);
   if(!env.SMTP_HOST||!env.SMTP_USER||!env.SMTP_PASS||![465,587].includes(port)) throw Object.assign(new Error('SMTP not configured'),{code:'SMTP_NOT_CONFIGURED'});
   transport=createTransport({host:env.SMTP_HOST,port,secure:port===465,requireTLS:true,auth:{user:env.SMTP_USER,pass:env.SMTP_PASS},connectionTimeout:8000,greetingTimeout:8000,socketTimeout:10000,disableFileAccess:true,disableUrlAccess:true});
   const result=await transport.sendMail({from:{name:'Integral Holdings',address:recipient},to:recipient,replyTo:{name:data.name,address:data.email},subject:`Website enquiry: ${data.subject}`,text:`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\nSector: ${data.sector}\n\n${data.message}\n\nView enquiries: https://www.integralholdings.co/admin/inquiries`});
   if(!result.accepted?.length) throw Object.assign(new Error('Recipient rejected'),{code:'RECIPIENT_REJECTED'});
  } catch(error) {
   // Never log credentials or the visitor's message; the dashboard holds the copy.
   logger.error('Inquiry saved; email forwarding failed', {code:error.code || 'SMTP_ERROR'});
  } finally {transport?.close();}
  return res.status(200).json({message:'Thank you. Your message has been received.'});
 };
}
export default createHandler();

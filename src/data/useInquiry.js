import {useRef, useState} from 'react';

export function useInquiry(defaultSector='Group') {
 const [busy,setBusy]=useState(false),[feedback,setFeedback]=useState(''),[failed,setFailed]=useState(false);
 const pending=useRef(false);
 async function send(event) {
  event.preventDefault();if(pending.current)return;
  const form=event.currentTarget,fields=new FormData(form);
  setFeedback('');setFailed(false);
  pending.current=true;setBusy(true);
  try {
   const response=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:String(fields.get('name')||'').trim(),email:String(fields.get('email')||'').trim(),phone:String(fields.get('phone')||'').trim(),sector:fields.get('sector')||defaultSector,subject:fields.get('service')?`${defaultSector}: ${fields.get('service')}`:'Website inquiry',message:String(fields.get('message')||'').trim()}),signal:AbortSignal.timeout(45000)});
   if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.message?.includes('Too many')?'Too many messages. Please try again later.':'We could not send your message. Please try again or contact us by email.');}
   form.reset();setFeedback('Thank you. Your message has been received.');
  }catch(e){setFailed(true);setFeedback(e.name==='TimeoutError'?'Delivery could not be confirmed. Please contact us before sending again.':e.message);}
  finally{pending.current=false;setBusy(false);}
 }
 return {send,busy,feedback,failed};
}

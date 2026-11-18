import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from '../api/inquiries.js';
const env={VITE_SUPABASE_URL:'https://example.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'public-test',SMTP_HOST:'smtp.example.com',SMTP_PORT:'587',SMTP_USER:'owner@example.com',SMTP_PASS:'test-only'};
const body={name:'Visitor',email:'visitor@example.com',message:'Interested in your services',sector:'Group'};
async function run(overrides={},request={}) {
 const saved=[],sent=[],logs=[];
 const handler=createHandler({env,fetcher:async(_url,options)=>{saved.push(JSON.parse(options.body));return {ok:true};},createTransport:()=>({sendMail:async mail=>{sent.push(mail);return {accepted:['support@integralholdings.co']};},close(){}}),logger:{error:(...args)=>logs.push(args)},...overrides});
 const res={setHeader(){},status(code){this.statusCode=code;return this;},json(data){this.body=data;return this;}};
 await handler({method:'POST',headers:{'content-type':'application/json'},body,...request},res);
 return {res,saved,sent,logs};
}
test('saves allowed fields and sends only to support with visitor reply-to',async()=>{
 const {res,saved,sent}=await run({}, {body:{...body,to:'attacker@example.com',status:'read'}});
 assert.equal(res.statusCode,200);assert.equal(saved.length,1);assert.equal(saved[0].status,undefined);
 assert.equal(sent[0].to,'support@integralholdings.co');assert.equal(sent[0].from.address,'support@integralholdings.co');assert.equal(sent[0].replyTo.address,body.email);
});
test('invalid input cannot save or send',async()=>{
 for(const invalid of [{...body,email:'bad'}, {...body,subject:'Hello\r\nBcc: other@example.com'},{...body,sector:'Invalid'},{...body,message:'x'.repeat(10001)}]){
  const result=await run({}, {body:invalid});assert.equal(result.res.statusCode,400);assert.equal(result.saved.length,0);assert.equal(result.sent.length,0);
 }
});
test('database rate limit prevents forwarding',async()=>{
 const result=await run({fetcher:async()=>({ok:false,json:async()=>({message:'Too many messages'})})});
 assert.equal(result.res.statusCode,429);assert.equal(result.sent.length,0);
});
test('SMTP failure preserves saved enquiry without exposing credentials',async()=>{
 const result=await run({createTransport:()=>({sendMail:async()=>{throw Object.assign(new Error('secret'),{code:'EAUTH'});},close(){}})});
 assert.equal(result.res.statusCode,200);assert.equal(result.saved.length,1);assert.equal(result.logs[0][1].code,'EAUTH');assert.ok(!JSON.stringify(result).includes('secret'));
});
test('missing SMTP configuration preserves dashboard copy',async()=>{
 const result=await run({env:{...env,SMTP_PASS:''}});assert.equal(result.res.statusCode,200);assert.equal(result.saved.length,1);assert.equal(result.sent.length,0);
});
test('GET is rejected',async()=>{const result=await run({}, {method:'GET'});assert.equal(result.res.statusCode,405);assert.equal(result.sent.length,0);});

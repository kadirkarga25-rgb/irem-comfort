import { NextRequest, NextResponse } from 'next/server';
const COOKIE='ic_admin';
async function valid(token?:string){
  if(!token)return false;
  const [ts,sig]=token.split('.'); if(!ts||!sig)return false;
  const age=Date.now()-Number(ts); if(age<0||age>1000*60*60*12)return false;
  const secret=new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || 'change-this-irem-comfort-session-secret');
  const key=await crypto.subtle.importKey('raw',secret,{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const buf=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(ts));
  const expected=Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  return expected===sig;
}
export async function proxy(req:NextRequest){
  if(!req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname==='/admin/login')return NextResponse.next();
  if(await valid(req.cookies.get(COOKIE)?.value))return NextResponse.next();
  return NextResponse.redirect(new URL('/admin/login',req.url));
}
export const config={matcher:['/admin/:path*']};

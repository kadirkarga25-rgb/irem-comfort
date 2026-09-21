'use client';
import { useEffect,useState } from 'react';
export function Loader(){const[show,setShow]=useState(true);useEffect(()=>{const t=setTimeout(()=>setShow(false),900);return()=>clearTimeout(t)},[]);if(!show)return null;return <div className="viewer-loading" style={{position:'fixed',inset:0,zIndex:9999}}><div className="loader-box"><div className="ic-loader"><div className="ic-ring"/><img src="/katalog/assets/logo-light.png"/></div><p>İREM COMFORT</p></div></div>}

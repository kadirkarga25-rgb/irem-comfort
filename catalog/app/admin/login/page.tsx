'use client';
import {useEffect,useState} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import {LockKeyhole} from 'lucide-react';
import {setCatalogAdminToken} from '../../../lib/db';
export default function AdminLogin(){
 const [password,setPassword]=useState(''); const [username,setUsername]=useState('admin'); const [error,setError]=useState(''); const [busy,setBusy]=useState(false); const router=useRouter(); const search=useSearchParams();
 useEffect(()=>{const bridge=search.get('bridge'); if(bridge){setCatalogAdminToken(bridge); router.replace('/admin');}},[search,router]);
 const submit=async(e:React.FormEvent)=>{e.preventDefault();setBusy(true);setError('');try{const r=await fetch('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username,password})});const d=await r.json();if(r.ok&&d.success&&d.token){setCatalogAdminToken(d.token);router.replace('/admin');router.refresh()}else setError(d.error||'Giriş yapılamadı.');}catch{setError('Ana yönetim sunucusuna bağlanılamadı.')}finally{setBusy(false)}};
 return <main className="admin-login"><div className="admin-login-card"><img src="/katalog/assets/logo-light.png" alt="İrem Comfort"/><div className="eyebrow">KATALOG YÖNETİMİ</div><h1 className="serif">Yönetici Girişi</h1><p>Ana İrem Comfort yönetici oturumunuz kullanılır.</p><form onSubmit={submit}><div className="field"><label>Kullanıcı adı</label><input autoFocus value={username} onChange={e=>setUsername(e.target.value)} placeholder="admin"/></div><div className="field"><label>Yönetici şifresi</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Şifrenizi girin"/></div>{error&&<div className="status error">{error}</div>}<button className="btn btn-primary" disabled={busy}><LockKeyhole size={17}/>{busy?'Kontrol ediliyor…':'Giriş Yap'}</button></form></div></main>
}

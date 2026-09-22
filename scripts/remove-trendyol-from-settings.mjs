#!/usr/bin/env node
import fs from 'node:fs';
const path='public/site_settings.json';
if(!fs.existsSync(path)){ console.error('public/site_settings.json bulunamadı.'); process.exit(1); }
const raw=fs.readFileSync(path,'utf8');
const data=JSON.parse(raw);
let changed=0;
const forbidden=/trendyol/i;
function walk(v){
  if(Array.isArray(v)){
    for(let i=v.length-1;i>=0;i--){
      const x=v[i];
      if(typeof x==='string' && forbidden.test(x)){ v.splice(i,1); changed++; }
      else walk(x);
    }
    return;
  }
  if(v && typeof v==='object'){
    for(const k of Object.keys(v)){
      if(forbidden.test(k)){ delete v[k]; changed++; continue; }
      const x=v[k];
      if(typeof x==='string' && forbidden.test(x)){ delete v[k]; changed++; continue; }
      walk(x);
    }
  }
}
walk(data);
fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n','utf8');
console.log(`Trendyol kayıtları temizlendi: ${changed}`);

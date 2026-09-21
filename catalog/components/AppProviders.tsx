'use client';
import { useEffect,useState } from 'react';
import { seedIfEmpty } from '../lib/db';
export function AppProviders({children}:{children:React.ReactNode}){const[ready,setReady]=useState(false);useEffect(()=>{seedIfEmpty().finally(()=>setReady(true))},[]);return <>{ready?children:null}</>}

'use client';
import {useEffect,useMemo,useRef,useState} from 'react'; import {useParams,useSearchParams} from 'next/navigation'; import {getCatalog,Catalog,Collection} from '../../../../lib/db'; import CatalogViewer from '../../../../components/CatalogViewer';
export default function ViewerPage(){const {id}=useParams<{id:string}>(); return <CatalogViewer id={id}/>}

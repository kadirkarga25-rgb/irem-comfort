export type PdfLibraryItem = {
  id: string;
  name: string;
  filename: string;
  path: string;
  rawUrl: string;
  size: number;
  createdAt: number;
  updatedAt: number;
};

const API = '/api';
const token = () => typeof window === 'undefined' ? '' : sessionStorage.getItem('ic_catalog_admin_token') || '';

export async function listPdfLibrary(): Promise<PdfLibraryItem[]> {
  const r = await fetch(`${API}/pdf-library/admin/list`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token()}` }
  });
  if (!r.ok) throw new Error('PDF kütüphanesi alınamadı.');
  const d = await r.json();
  return Array.isArray(d?.files) ? d.files : [];
}

export async function uploadPdfToLibrary(file: File): Promise<PdfLibraryItem> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const id = `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const r = await fetch(`${API}/pdf-library/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
    body: JSON.stringify({
      id,
      filename: file.name,
      size: file.size,
      data: `data:${file.type || 'application/pdf'};base64,${btoa(binary)}`
    })
  });
  const d = await r.json();
  if (!r.ok || !d?.success) throw new Error(d?.error || 'PDF GitHub kütüphanesine yüklenemedi.');
  return d.file;
}

export async function deletePdfFromLibrary(id: string): Promise<void> {
  const r = await fetch(`${API}/pdf-library/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
    body: JSON.stringify({ id })
  });
  const d = await r.json();
  if (!r.ok || !d?.success) throw new Error(d?.error || 'PDF silinemedi.');
}

export function getPdfLibraryAdminToken() { return token(); }

/**
 * IC CMS PRO - Enterprise CRM & Customer Management Module Types
 */

export type CustomerType = 'wholesale' | 'retail' | 'lead' | 'vip';
export type CustomerStatus = 'active' | 'prospect' | 'contacted' | 'inactive';

export interface CustomerInquiryHistory {
  id: string;
  date: string;
  type: string;
  message: string;
  channel: 'website' | 'whatsapp' | 'email' | 'phone';
  resolvedBy?: string;
}

export interface CustomerNote {
  id: string;
  createdAt: string;
  author: string;
  text: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  city?: string;
  customerType: CustomerType;
  status: CustomerStatus;
  totalOrdersOrInquiries: number;
  tags: string[];
  notes: CustomerNote[];
  inquiriesHistory: CustomerInquiryHistory[];
  createdAt: string;
  lastContactedAt?: string;
}

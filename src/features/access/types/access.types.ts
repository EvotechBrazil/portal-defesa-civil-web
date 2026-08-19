export type AccessRequestStatus =
  | "INTERESTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface AccessRequestView {
  id: string;
  whatsapp: string;
  name: string | null;
  lgndNumber: string | null;
  manada: string | null;
  email: string | null;
  justification: string | null;
  status: AccessRequestStatus;
  createdAt: string;
  reviewedAt: string | null;
}

export interface AllowedWhatsappView {
  id: string;
  whatsapp: string;
  label: string | null;
  createdAt: string;
}

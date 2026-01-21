import { api } from './api';
import type { SupportCategory } from './validations/support';

export interface CreateTicketRequest {
  name: string;
  email: string;
  subject: string;
  category: SupportCategory;
  message: string;
}

export interface SupportTicket {
  referenceId: string;
  name: string;
  email: string;
  subject: string;
  category: SupportCategory;
  status: string;
  createdAt: string;
}

export interface CreateTicketResponse {
  message: string;
  referenceId: string;
  ticket: SupportTicket;
}

class SupportService {
  async createTicket(data: CreateTicketRequest): Promise<CreateTicketResponse> {
    return api.post<CreateTicketResponse>('/support', data);
  }
}

export const supportService = new SupportService();

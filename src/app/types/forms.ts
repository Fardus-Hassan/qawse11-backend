export type FormType = 'GET_IN_TOUCH' | 'CONTACT' | 'CONSULTATION';

export interface GetInTouchDTO {
  name: string;
  email: string;
  message: string;
}

export interface ContactDTO {
  first_name: string;
  last_name: string;
  email: string;
  company_name?: string;
  country: string;
  project_type: string;
  budget_range: string;
  message: string;
}

export interface ConsultationDTO {
  first_name: string;
  last_name: string;
  email: string;
  company_name?: string;
  timeline: string;
  country: string;
  project_type: string;
  budget_range: string;
  helps?: string[];
  project_details: string;
}

export type FormPayload = GetInTouchDTO | ContactDTO | ConsultationDTO;

export type FormFilter = 'getInTouch' | 'contact' | 'consultation';

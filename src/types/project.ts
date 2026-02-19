import { Customer, initialCustomer } from "./customer";
import { ProjectDateResponse } from "./date";
import { ProjectContractResponse } from "./deadline";

export interface Task {
  id: string;
  actionId?: number;
  assignedId?: number;
  assignedTo?: string;
  action: string;
  otherName?: string;
  dueDate: string;
  emailAlert: boolean;
  comment: string;
  isNew?: boolean;
}

export interface ProjectWizardData {
  projectId?: number;
  projectName: string;
  countryId: number;
  country?: string;
  state?: string;
  stateId: number;
  projectTypeId: number;
  roleId: number;
  customerTypeId: number;

  startDate: string;
  endDate: string;
  furnishingDates: string[];
  completionDate?: string;
  firstFurnishingDate?: string;
  lastFurnishingDate?: string;

  jobName: string;
  jobAddress: string;
  jobCity: string;
  jobStateId: number;
  jobZip: string;
  jobCountyId: number;
  jobCountryId: number;

  contractAmount: string;
  baseContractAmount: string;
  additionalCosts: string;
  revisedCost: string;
  paymentsCredits: string;
  unpaidBalance: string;
  jobProjectNumber: string;
  materialServicesDescription: string;
  customerContacts: Customer[];
  selectedCustomerContacts: Customer;
  selectedProjectContacts: Customer[];
  projectContacts: Customer[];

  documents: File[];

  tasks: Task[];
  removedTasks: string[];

  customerSignature: string;
  signatureDate: string;
}

export const initialProjectWizardData: ProjectWizardData = {
  projectId: undefined,
  projectName: '',
  countryId: 0,
  stateId: 0,
  projectTypeId: 0,
  roleId: 0,
  customerTypeId: 0,

  startDate: '',
  endDate: '',
  furnishingDates: [],
  completionDate: '',
  firstFurnishingDate: '',
  lastFurnishingDate: '',

  jobName: '',
  jobAddress: '',
  jobCity: '',
  jobStateId: 0,
  jobZip: '',
  jobCountryId: 0,
  jobCountyId: 0,

  contractAmount: '',
  baseContractAmount: '',
  additionalCosts: '',
  revisedCost: '',
  paymentsCredits: '',
  unpaidBalance: '',
  jobProjectNumber: '',
  materialServicesDescription: '',
  customerContacts: [],
  selectedCustomerContacts: initialCustomer,
  selectedProjectContacts: [],
  projectContacts: [],

  documents: [],

  tasks: [],
  removedTasks: [],

  customerSignature: '',
  signatureDate: '',
  country: '',
  state: '',
};


export interface WizardDraftResponse {
  draft_id?: number;
  step?: number;
  data: ProjectWizardData;
  isDraft: boolean;
}

export interface ProjectStatusCount {
  total: number;
  inprogress: number;
  active: number;
  completed: number;
}

export interface ProjectListRequest {
  page: number;
  per_page: number;
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  status?: string;
  state_id?: string;
}

export interface TaskResponse {
  id: number;
  project_id: number;
  task_action_id: number;
  task_name: string;
  complete_date: string;
  comment: string;
  email_alert: string;
  assigned_to: number;
  assigned_by: number;
  assigned_at: string;
  status: string;
}

export interface DocumentResponse {
  id: number;
  project_id: number;
  title: string;
  notes: string;
  date: string;
  filename: string;
}

export interface DBProject {
  id: string;
  project_name: string;
  status: string;
  user_id: string;
  address: string;
  city: string;
  zip: any;
  start_date: string;
  state: string;
  tasks: TaskResponse[];
  project_date: ProjectDateResponse[];
  documents: DocumentResponse[];
  project_contract: ProjectContractResponse;
  created_at: string;
}
export interface Task {
  id: string;
  action: string;
  dueDate: string;
  emailAlert: boolean;
  comment: string;
  waiverAmount: string;
  receivableStatus: string;
  deadlineCalculationStatus: string;
}

export interface ProjectWizardData {
  projectId?: number;
  projectName: string;
  countryId: number;
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

  selectedContacts: string[];

  documents: File[];

  tasks: Task[];

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

  selectedContacts: [],

  documents: [],

  tasks: [],

  customerSignature: '',
  signatureDate: '',
};


export interface WizardDraftResponse {
  draft_id?: number;
  step?: number;
  data: ProjectWizardData;
  isDraft: boolean;
}
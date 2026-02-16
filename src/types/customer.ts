export interface CustomerContact {
  role_id: number;
  firstName: string;
  lastName: string;
  email: string;
  directPhone: string;
  cell: string;
  id?: number
}

export interface Customer {
  id?: number;
  role_id?: number;
  user_id?: string;
  company: string;
  website: string;
  address: string;
  city: string;
  state_id: number;
  zip: string;
  phone: string;
  fax: string;
  contacts: CustomerContact[];
  created_at?: string;
  updated_at?: string;
  is_new?: boolean;
}

export const initialCustomer: Customer = {
  company: '',
  website: '',
  address: '',
  city: '',
  state_id: 0,
  zip: '',
  phone: '',
  fax: '',
  contacts: [],
  role_id: 0,
  is_new: false,
  id: 0
};

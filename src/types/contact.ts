export type ContactRoleType = "customer" | "project";

export interface ContactRoleRequest {
  type: ContactRoleType;
}

export interface ContactRole {
  id: number;
  name: string;
  role_type: ContactRoleType;
}
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
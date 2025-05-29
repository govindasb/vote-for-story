import { SessionPermission } from "./session-permission.enum";

export interface Vote {
  userName: string;
  value?: string | null;
  permission?: SessionPermission;
};
import { AppPermissions } from "./app-permissions.enum";

export type UserProfile = {
    uuid: string;
    name: string;
    permission: AppPermissions;
}
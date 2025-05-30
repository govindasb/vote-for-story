import { UserProfile } from "./user-profile";
import { Vote } from "./vote";

export interface SessionData {
    title: string;
    users: string[];
    userProfiles: UserProfile[];
    votes: Vote[];
    revealed: boolean;
}
import { Vote } from "./vote";

export interface SessionData {
    users: string[];
    votes: Vote[];
    revealed: boolean;
}
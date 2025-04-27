import { Vote } from "./vote";

export interface SessionData {
    title: string;
    users: string[];
    votes: Vote[];
    revealed: boolean;
}
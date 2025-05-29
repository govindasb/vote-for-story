interface SessionUser {
    userName: string;
    sessionId: string;
    guid: string;
    permission: 'admin' | 'voter';
}
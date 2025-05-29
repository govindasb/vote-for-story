import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { doc, setDoc, getDoc, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { SessionData } from '../types/session-data';
import { Vote } from '../types/vote';
import { SessionPermission } from '../types/session-permission.enum';
@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionId: string = '';
  private sessionTitle: string = '';
  private userName = new BehaviorSubject<string>('');
  private userPermission = new BehaviorSubject<SessionPermission>(SessionPermission.READ);
  private users = new BehaviorSubject<string[]>([]);
  private votes = new BehaviorSubject<Vote[]>([]);
  private revealed = new BehaviorSubject<boolean>(false);
  private isSessionEnded = new BehaviorSubject<boolean>(false);
  private sessionWasActive = false;

  userName$ = this.userName.asObservable();
  users$ = this.users.asObservable();
  userPermission$ = this.userPermission.asObservable();
  votes$ = this.votes.asObservable();
  revealed$ = this.revealed.asObservable();
  isSessionEnded$ = this.isSessionEnded.asObservable();

  setSessionId(id: string) {
    this.sessionId = id;
    this.startListening();
  }

  setPermissions(permission: SessionPermission) {
    this.userPermission.next(permission);
  }

  setUserName(name: string) {
    this.userName.next(name);
    const vote: Vote = { userName: name, value: '-' };
    this.addUserToSession(vote);
  }

  setSessionTitle(title: string) {
    this.sessionTitle = title;
  }

  getSessionTitle(): string {
    return this.sessionTitle;
  }

  private async addUserToSession(vote: Vote) {
    if (!this.sessionId) return;
    const sessionRef = doc(db, 'sessions', this.sessionId);
    const sessionSnap = await getDoc(sessionRef);
    if (!sessionSnap.exists()) {
      const newVote: Vote = { userName: vote.userName, value: '-' };
      const newSession: SessionData = {
        title: this.sessionTitle,
        users: [vote.userName],
        votes: [newVote],
        revealed: false,
      };
      await setDoc(sessionRef, newSession);
    } else {
      const data = sessionSnap.data() as SessionData;
      const updatedUsers = Array.from(new Set([...data.users, vote.userName]));
      const updatedVotes = [...data.votes, vote];
      await setDoc(sessionRef, {
        users: updatedUsers,
        votes: updatedVotes,
        revealed: data.revealed,
      });
    }
  }

  async castVote(name: string, vote: string) {
    const sessionRef = doc(db, 'sessions', this.sessionId);
    const sessionSnap = await getDoc(sessionRef);
    const data = sessionSnap.data() as SessionData;

    const updatedVotes = data.votes ?? [];
    const existingIndex = updatedVotes.findIndex((v) => v.userName === name);
    if (existingIndex !== -1) {
      updatedVotes[existingIndex].value = vote;
    } else {
      updatedVotes.push({ userName: name, value: vote });
    }
    await updateDoc(sessionRef, { votes: updatedVotes });
  }

  async revealVotes() {
    const sessionRef = doc(db, 'sessions', this.sessionId);
    await updateDoc(sessionRef, { revealed: true });
  }

  async clearVotes() {
    const sessionRef = doc(db, 'sessions', this.sessionId);
    const sessionSnap = await getDoc(sessionRef);
    const data = sessionSnap.data() as SessionData;
    const votes = data.votes.map((vote) => ({
      ...vote,
      value: '-',
    }));
    await updateDoc(sessionRef, {
      votes: votes,
      revealed: false,
    });
  }

  private startListening() {
    if (!this.sessionId || this.sessionId.trim() === '') {
      console.error('[SessionService] startListening: Missing sessionId');
      return;
    }
    const sessionRef = doc(db, 'sessions', this.sessionId);

    onSnapshot(sessionRef, (docSnap) => {
      if (!docSnap.exists()) {
        console.warn(
          `[SessionService] session "${this.sessionId}" does not exist`
        );
        if (this.sessionWasActive) this.isSessionEnded.next(true);
        return;
      }
      const data = docSnap.data() as SessionData;
      this.users.next(data.users);
      this.votes.next(data.votes || []);
      this.revealed.next(data.revealed || false);
      this.sessionWasActive = true;
    });
  }

  async deleteSession(): Promise<void> {
    if (!this.sessionId) return;

    const sessionRef = doc(db, 'sessions', this.sessionId);
    await deleteDoc(sessionRef);

    // Optionally, you could reset local subjects here if needed
    this.userName.next('');
    this.users.next([]);
    this.votes.next([]);
    this.revealed.next(false);
    this.sessionWasActive = false;
  }
}

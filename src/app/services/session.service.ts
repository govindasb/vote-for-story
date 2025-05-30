import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { doc, setDoc, getDoc, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { SessionData } from '../types/session-data';
import { Vote } from '../types/vote';
import { UserProfile } from '../types/user-profile';
@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionId: string = '';
  private sessionTitle: string = '';
  private userProfile = new BehaviorSubject<UserProfile | null>(null);
  private votes = new BehaviorSubject<Vote[]>([]);
  private revealed = new BehaviorSubject<boolean>(false);
  private isSessionEnded = new BehaviorSubject<boolean>(false);
  private sessionWasActive = false;

  userProfile$ = this.userProfile.asObservable();
  votes$ = this.votes.asObservable();
  revealed$ = this.revealed.asObservable();
  isSessionEnded$ = this.isSessionEnded.asObservable();

  setSessionId(id: string) {
    this.sessionId = id;
    this.startListening();
  }

  getSessionId(): string {
    return this.sessionId;
  }

  setUserName(name: string, userProfile: UserProfile) {
    this.userProfile.next(userProfile);
    const vote: Vote = { userName: name, value: '-' };
    this.addUserToSession(vote, userProfile);
  }


  setSessionTitle(title: string) {
    this.sessionTitle = title;
  }

  getSessionTitle(): string {
    return this.sessionTitle;
  }

  private async addUserToSession(vote: Vote, userProfile?: UserProfile) {
    if (!this.sessionId) return;
    const sessionRef = doc(db, 'sessions', this.sessionId);
    const sessionSnap = await getDoc(sessionRef);
    if (!sessionSnap.exists()) {
      const newVote: Vote = { userName: vote.userName, value: '-' };
      const newSession: SessionData = {
        title: this.sessionTitle,
        users: [vote.userName],
        votes: [newVote],
        userProfiles: userProfile ? [userProfile] : [],
        revealed: false,
      };
      await setDoc(sessionRef, newSession);
    } else {
      const data = sessionSnap.data() as SessionData;
      const updatedUserProfiles = Array.from(new Set([...data.userProfiles, userProfile?? []]));
      const updatedUsers = Array.from(new Set([...data.users, vote.userName]));
      const updatedVotes = [...data.votes, vote];
      await setDoc(sessionRef, {
        userProfiles: updatedUserProfiles,
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
      this.votes.next(data.votes || []);
      this.revealed.next(data.revealed || false);
      this.sessionWasActive = true;
    });
  }

  async deleteSession(): Promise<void> {
    if (!this.sessionId) return;

    const sessionRef = doc(db, 'sessions', this.sessionId);
    await deleteDoc(sessionRef);

    this.userProfile.next(null);
    this.votes.next([]);
    this.revealed.next(false);
    this.sessionWasActive = false;
  }
}

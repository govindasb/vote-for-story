import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionId: string = '';
  private userName = new BehaviorSubject<string>('');
  private users = new BehaviorSubject<string[]>([]);
  private votes = new BehaviorSubject<Record<string, string>>({});
  private revealed = new BehaviorSubject<boolean>(false);

  userName$ = this.userName.asObservable();
  users$ = this.users.asObservable();
  votes$ = this.votes.asObservable();
  revealed$ = this.revealed.asObservable();

  setSessionId(id: string) {
    this.sessionId = id;
    this.startListening();
  }

  setUserName(name: string) {
    this.userName.next(name);
    this.addUserToSession(name);
  }

  private async addUserToSession(name: string) {
    if(!this.sessionId) {
      return;
    }
    const sessionRef = doc(db, 'sessions', this.sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      await setDoc(sessionRef, {
        users: [name],
        votes: {},
        revealed: false
      });
    } else {
      const data = sessionSnap.data();
      const updatedUsers = Array.from(new Set([...(data['users'] || []), name]));
      await updateDoc(sessionRef, { users: updatedUsers });
    }
  }

  async castVote(name: string, vote: string) {
    const sessionRef = doc(db, 'sessions', this.sessionId);
    const sessionSnap = await getDoc(sessionRef);
    const data = sessionSnap.data();

    const updatedVotes = { ...(data && data['votes'] ? data['votes'] : {}), [name]: vote };

    await updateDoc(sessionRef, { votes: updatedVotes });
  }

  async revealVotes() {
    const sessionRef = doc(db, 'sessions', this.sessionId);
    await updateDoc(sessionRef, { revealed: true });
  }

  async clearVotes() {
    const sessionRef = doc(db, 'sessions', this.sessionId);
    await updateDoc(sessionRef, {
      votes: {},
      revealed: false
    });
  }

  private startListening() {
    const sessionRef = doc(db, 'sessions', this.sessionId);

    onSnapshot(sessionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.users.next(data['users'] || []);
        this.votes.next(data['votes'] || {});
        this.revealed.next(data['revealed'] || false);
      }
    });
  }
}
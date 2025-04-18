import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  sessionId: string = '';
  voteValues = ['0', '1/2', '1', '2', '3', '5', '8', '13', '22', '100'];

  userName = '';
  users: string[] = [];
  votes: Record<string, string> = {};
  revealed = false;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('id') || '';
    this.sessionService.setSessionId(this.sessionId);
    this.sessionService.userName$.subscribe(name => this.userName = name);
    this.sessionService.users$.subscribe(users => this.users = users);
    this.sessionService.votes$.subscribe(votes => this.votes = votes);
    this.sessionService.revealed$.subscribe(flag => this.revealed = flag);
    this.sessionId = this.route.snapshot.paramMap.get('id') || '';
      
  }

  vote(value: string) {
    this.sessionService.castVote(this.userName, value);
  }

  showVotes() {
    this.sessionService.revealVotes();
  }

  clearVotes() {
    this.sessionService.clearVotes();
  }

  getVoteForUser(user: string): string {
    if (this.revealed) return this.votes[user] || '-';
    return user === this.userName && this.votes[user] ? '✔️' : '⏳';
  }
}

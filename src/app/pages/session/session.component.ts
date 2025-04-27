import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { Vote } from 'src/app/types/vote';
import { VoteFrequency } from 'src/app/types/vote-frequency';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
})
export class SessionComponent implements OnInit {
  sessionId: string = '';
  voteValues = ['0', '1/2', '1', '2', '3', '5', '8', '13', '22', '100'];

  userName = '';
  users: string[] = [];
  votes$ = this.sessionService.votes$;
  revealed = false;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('id') || '';
    this.sessionService.setSessionId(this.sessionId);
    this.sessionService.userName$.subscribe((name) => (this.userName = name));
    this.sessionService.revealed$.subscribe((flag) => (this.revealed = flag));
    this.sessionId = this.route.snapshot.paramMap.get('id') || '';
    this.votes$.pipe(tap((data) => console.log(data)));
  }

  vote(value: string) {
    this.sessionService.castVote(this.userName, value);
  }

  showVotes() {
    this.sessionService.revealVotes();
  }

  clearVotes() {
    this.votes$.pipe(tap((data) => console.log(data))).subscribe();
    this.sessionService.clearVotes();
  }


  getVoteFrequencies(votes: Vote[]): VoteFrequency[] {
    const voteMap = new Map<string, number>();

  votes.forEach((v) => {
    if (v.value) {
      voteMap.set(v.value, (voteMap.get(v.value) || 0) + 1);
    }
  });

  const maxCount = Math.max(...voteMap.values(), 0);

  return Array.from(voteMap.entries()).map(([vote, count]) => ({
    vote,
    count,
    isHighest: count === maxCount,
  }));
  }
}

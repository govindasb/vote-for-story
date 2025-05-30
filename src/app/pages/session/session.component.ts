import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from 'src/app/constants/urls';
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
  isLinkCopied = false;
  userProfile$ = this.sessionService.userProfile$;
  votes$ = this.sessionService.votes$;
  revealed = false;
  sessionEnded = false;
  sessionEnded$ = this.sessionService.isSessionEnded$;
  baseUrl = API_URL;
  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('id') || '';
    this.sessionService.setSessionId(this.sessionId);
    // this.sessionService.userName$.subscribe((name) => (this.userName = name));
    this.sessionService.revealed$.subscribe((flag) => (this.revealed = flag));
    this.sessionId = this.route.snapshot.paramMap.get('id') || '';
    this.sessionEnded$.subscribe((ended) => {
      if (ended) {
        this.sessionEnded = true;
  
        // Auto-redirect after 1 minute
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 60000); // 60,000 ms = 1 min
      }
    });
  }

  vote(value: string, name: string) {
    this.sessionService.castVote(name, value);
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

  deleteSession() {
    if (confirm('Are you sure you want to delete this session?')) {
      this.sessionService.deleteSession().then(() => {
        this.router.navigate(['/']);
      });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  sessionSharableLink(): string{
    return `${this.baseUrl}/session/${this.sessionId}/join`;
  }

  copyShareLink() {
    navigator.clipboard.writeText(this.sessionSharableLink()).then(() => {
      this.isLinkCopied = true;
      setTimeout(() => {
        this.isLinkCopied = false;
      }, 5000); // 5 seconds toast visibility
    }).catch((err) => {
      console.error('Could not copy link: ', err);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { POKER_CARD_IMAGES_AND_VALUES } from 'src/app/constants/poker-card-images-and-values';
import { API_URL } from 'src/app/constants/urls';
import { SessionService } from 'src/app/services/session.service';
import { SessionPermission } from 'src/app/types/session-permission.enum';
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
  pokerCards = POKER_CARD_IMAGES_AND_VALUES;
  userName = '';
  adminPermission = SessionPermission.ADMIN;
  permission!: SessionPermission;
  users: string[] = [];
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
    this.sessionService.userName$.subscribe((name) => (this.userName = name));
    this.sessionService.revealed$.subscribe((flag) => (this.revealed = flag));
    this.sessionService.userPermission$.subscribe(
      (permission) => (this.permission = permission)
    );
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

  vote(value: number) {
    this.pokerCards.map((card) => {
      if (card.value === value) {
        card.isSelected = true;
      }
    });
    this.sessionService.castVote(this.userName, value.toString());
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

  sessionSharableLink(): string {
    return `${this.baseUrl}/session/${this.sessionId}/join`;
  }

  copyShareLink() {
    navigator.clipboard
      .writeText(this.sessionSharableLink())
      .then(() => {
        this.isLinkCopied = true;
        setTimeout(() => {
          this.isLinkCopied = false;
        }, 5000); // 5 seconds toast visibility
      })
      .catch((err) => {
        console.error('Could not copy link: ', err);
      });
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { SessionPermission } from 'src/app/types/session-permission.enum';

@Component({
  selector: 'app-join-session-by-link',
  templateUrl: './join-session-by-link.component.html',
  styleUrls: ['./join-session-by-link.component.css'],
})
export class JoinSessionByLinkComponent {
  sessionId!: string;
  name!: string;
  sessionTitle: string = '';
  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.sessionTitle = this.sessionService.getSessionTitle();
  }
  
  
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.sessionId = data['sessionId'];
    });
  }

  joinSession() {
    if (!this.name.trim() || !this.sessionId.trim()) return;
    this.sessionService.setSessionId(this.sessionId);
    this.sessionService.setUserName(this.name);
    this.sessionService.setPermissions(SessionPermission.WRITE);
    this.router.navigate(['/session', this.sessionId]);
  }
}

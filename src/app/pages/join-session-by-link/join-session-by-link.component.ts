import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { generateGuid } from 'src/app/shared/helpers/generate-unique-id';
import { AppPermissions } from 'src/app/types/app-permissions.enum';
import { UserProfile } from 'src/app/types/user-profile';

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
    const userProfile = {
          name: this.name,
          uuid: generateGuid(),
          permission: AppPermissions.User
    
        } as UserProfile;
    this.sessionService.setUserName(this.name, userProfile);
    this.router.navigate(['/session', this.sessionId]);
  }
}

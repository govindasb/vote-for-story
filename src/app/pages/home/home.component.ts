import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { generateGuid } from 'src/app/shared/helpers/generate-unique-id';
import { AppPermissions } from 'src/app/types/app-permissions.enum';
import { UserProfile } from 'src/app/types/user-profile';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  name = '';
  sessionId = '';
  sessionName = '';

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  generateSessionId(): string {
    return Math.random().toString(36).substring(2, 8); 
  }

  createSession() {
    if (!this.name.trim()) return;
    const newSessionId = this.generateSessionId();
    this.sessionService.setSessionId(newSessionId);
    const userProfile = {
      name: this.name,
      uuid: generateGuid(),
      permission: AppPermissions.Admin

    } as UserProfile;
    this.sessionService.setUserName(this.name, userProfile);
    this.sessionService.setSessionTitle('');
    this.router.navigate(['/session', newSessionId]);
  }

  joinSession() {
    if (!this.sessionName.trim() || !this.sessionId.trim()) return;
    this.sessionService.setSessionId(this.sessionId);
    const userProfile = {
      name: this.name,
      uuid: generateGuid(),
      permission: AppPermissions.User,

    } as UserProfile;
    this.sessionService.setUserName(this.sessionName, userProfile);
    this.router.navigate(['/session', this.sessionId]);
  }
}

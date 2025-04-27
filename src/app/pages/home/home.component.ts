import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

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
    return Math.random().toString(36).substring(2, 8); // e.g., 'a1b2c3'
  }

  createSession() {
    if (!this.name.trim()) return;
    const newSessionId = this.generateSessionId();
    this.sessionService.setSessionId(newSessionId);
    this.sessionService.setUserName(this.name);
    this.router.navigate(['/session', newSessionId]);
  }

  joinSession() {
    if (!this.sessionName.trim() || !this.sessionId.trim()) return;
    this.sessionService.setSessionId(this.sessionId);
    this.sessionService.setUserName(this.sessionName);
    this.router.navigate(['/session', this.sessionId]);
  }
}

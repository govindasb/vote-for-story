import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SessionComponent } from './pages/session/session.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { JoinSessionByLinkComponent } from './pages/join-session-by-link/join-session-by-link.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SessionComponent,
    JoinSessionByLinkComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

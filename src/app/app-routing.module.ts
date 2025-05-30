import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SessionComponent } from './pages/session/session.component';
import { JoinSessionByLinkComponent } from './pages/join-session-by-link/join-session-by-link.component';
import { getSessionIdFromUrl } from './resolvers/get-session-id-from-url.resolver';
import { sessionAccessGuard } from './guards/session-access.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'session/:id',
    component: SessionComponent,
    canActivate: [sessionAccessGuard],
  },
  {
    path: 'session/:id/join',
    component: JoinSessionByLinkComponent,
    resolve: {
      sessionId: getSessionIdFromUrl, // ✅ simple function
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

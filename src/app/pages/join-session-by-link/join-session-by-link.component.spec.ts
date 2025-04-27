import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinSessionByLinkComponent } from './join-session-by-link.component';

describe('JoinSessionByLinkComponent', () => {
  let component: JoinSessionByLinkComponent;
  let fixture: ComponentFixture<JoinSessionByLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinSessionByLinkComponent]
    });
    fixture = TestBed.createComponent(JoinSessionByLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

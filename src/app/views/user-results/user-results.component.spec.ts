import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResultsComponent } from './user-results.component';

describe('UserResultsComponent', () => {
  let component: UserResultsComponent;
  let fixture: ComponentFixture<UserResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

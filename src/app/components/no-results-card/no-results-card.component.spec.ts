import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultsCardComponent } from './no-results-card.component';

describe('NoResultsCardComponent', () => {
  let component: NoResultsCardComponent;
  let fixture: ComponentFixture<NoResultsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoResultsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoResultsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const _fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const _app: AppComponent = _fixture.componentInstance;

    expect(_app).toBeTruthy();
  });

  it('should render title', () => {
    const _fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const _compiled: HTMLElement = _fixture.nativeElement as HTMLElement;

    _fixture.detectChanges();
    expect(_compiled.querySelector('h1')?.textContent).toContain('Hello, gumi');
  });
});

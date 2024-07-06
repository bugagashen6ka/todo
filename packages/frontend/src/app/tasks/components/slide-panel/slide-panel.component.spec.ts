import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlidePanelComponent } from './slide-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MockAnimationDriver } from '@angular/animations/browser/testing';
import { AnimationDriver } from '@angular/animations/browser';

describe('SlidePanelComponent', () => {
  let component: SlidePanelComponent;
  let fixture: ComponentFixture<SlidePanelComponent>;
  let debugElement: DebugElement;
  let animatedElement: HTMLDivElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlidePanelComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        {
          provide: AnimationDriver,
          useClass: MockAnimationDriver,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidePanelComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.onClose, 'emit').mockReset();

    debugElement = fixture.debugElement;
    fixture.detectChanges();
    const element = fixture.nativeElement;
    animatedElement = element.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header text', () => {
    component.isOpen = true;
    component.headerText = 'Test Header';
    fixture.detectChanges();

    const headerElement = debugElement.query(By.css('h4')).nativeElement;
    expect(headerElement.textContent).toContain('Test Header');
  });

  it('should emit onClose event when onClosePanel is called', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const onClosePanel = fixture.debugElement.query(By.css(`[data-testid="onClosePanel"]`));
    onClosePanel.triggerEventHandler('click');

    expect(component.onClose.emit).toHaveBeenCalledWith(false);
  });
});

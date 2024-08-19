import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPerformanceComponent } from './annual-performance.component';

describe('AnnualPerformanceComponent', () => {
  let component: AnnualPerformanceComponent;
  let fixture: ComponentFixture<AnnualPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnualPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeOverviewComponent } from './realtime-overview.component';

describe('RealtimeOverviewComponent', () => {
  let component: RealtimeOverviewComponent;
  let fixture: ComponentFixture<RealtimeOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealtimeOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtimeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

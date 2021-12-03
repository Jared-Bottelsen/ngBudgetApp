import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetArchiveComponent } from './budget-archive.component';

describe('BudgetArchiveComponent', () => {
  let component: BudgetArchiveComponent;
  let fixture: ComponentFixture<BudgetArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetArchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

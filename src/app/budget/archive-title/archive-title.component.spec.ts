import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveTitleComponent } from './archive-title.component';

describe('ArchiveTitleComponent', () => {
  let component: ArchiveTitleComponent;
  let fixture: ComponentFixture<ArchiveTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSlotCapacityComponent } from './modal-slot-capacity.component';

describe('ModalSlotCapacityComponent', () => {
  let component: ModalSlotCapacityComponent;
  let fixture: ComponentFixture<ModalSlotCapacityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSlotCapacityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSlotCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

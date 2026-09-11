import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorFacialComponent } from './validator-facial.component';

describe('ValidatorFacialComponent', () => {
  let component: ValidatorFacialComponent;
  let fixture: ComponentFixture<ValidatorFacialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidatorFacialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidatorFacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

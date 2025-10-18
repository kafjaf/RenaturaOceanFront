import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesInfoComponent } from './species-info.component';

describe('SpeciesInfoComponent', () => {
  let component: SpeciesInfoComponent;
  let fixture: ComponentFixture<SpeciesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeciesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeciesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

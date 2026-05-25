import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoDashboard } from './catalogo-dashboard';

describe('CatalogoDashboard', () => {
  let component: CatalogoDashboard;
  let fixture: ComponentFixture<CatalogoDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CatalogoDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

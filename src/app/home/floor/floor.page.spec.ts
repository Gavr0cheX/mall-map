import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FloorPage } from './floor.page';

describe('FloorPage', () => {
  let component: FloorPage;
  let fixture: ComponentFixture<FloorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

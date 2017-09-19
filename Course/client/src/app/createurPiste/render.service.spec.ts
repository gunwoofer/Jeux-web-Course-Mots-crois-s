import { FormsModule } from '@angular/forms';
import { PisteValidationComponent } from './../piste/pisteValidation.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CreateurPiste } from './createurPiste.component';
import { TestBed, inject, ComponentFixture, async } from '@angular/core/testing';

import { RenderService } from './render.service';

describe('RenderService', () => {

  let component: CreateurPiste;
  let fixture: ComponentFixture<CreateurPiste>;
  let renderService: RenderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [RenderService],
      declarations: [ CreateurPiste, PisteValidationComponent ],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(inject([RenderService], (service: RenderService) => {
    renderService = service;
    fixture = TestBed.createComponent(CreateurPiste);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(renderService).toBeTruthy();
  });

  it('la zone de piste doit être initialement vide', () => {
    renderService.initialize(component.container);
    const length = renderService.obtenirScene().children.length;
    expect(length).toEqual(2);
  });

  it('il doit y avoir un evenement click', async() => {
    spyOn(component, 'onMouseDown');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.onMouseDown).toHaveBeenCalled();
    });
  });

});


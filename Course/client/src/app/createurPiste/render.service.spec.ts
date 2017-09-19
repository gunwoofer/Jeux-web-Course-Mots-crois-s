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
  let fakeClickEvent: MouseEvent;

  /*const fakeClickEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
    });*/


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
    const length = renderService.obtenirScene().children.length;
    expect(length).toEqual(2);
  });

  it('il doit y avoir un evenement mouseUp pour créer un point', () => {
      fakeClickEvent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      renderService.onMouseUp(fakeClickEvent);
      length = renderService.retournerListePoints().length;
      expect(length).toEqual(1);
  });








});


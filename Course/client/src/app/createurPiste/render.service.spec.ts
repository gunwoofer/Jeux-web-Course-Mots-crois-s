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

  function mousevent(type: string, coordonneX: number, coordonneY: number, partie: number ) {
    return new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: coordonneX,
      clientY: coordonneY,
      button: partie
    });
  }


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


});


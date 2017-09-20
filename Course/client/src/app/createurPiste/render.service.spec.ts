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
  let fakeClickEventA: MouseEvent;
  let fakeClickEventB: MouseEvent;

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

  it('il faut clicker sur le button gauche pour la création de point', () => {
    fakeClickEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    renderService.onMouseClick(fakeClickEvent);
    expect(fakeClickEvent.button).toEqual(0);
});

  it('Le point est crée et ajouté à la scene et le vecteur points', () => {
      fakeClickEvent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      renderService.onMouseClick(fakeClickEvent);
      const longueurVecteurPoints = renderService.retournerListePoints().length;
      const longueurVecteurScene = renderService.obtenirScene().children.length;
      expect(longueurVecteurPoints).toEqual(1);
      expect(longueurVecteurScene).toEqual(3);
  });

  it('lobjet ajouté au vecteur de points est de type points', () => {
    fakeClickEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    const compteur = 0;
    renderService.onMouseClick(fakeClickEvent);
    const pointListe = renderService.retournerListePoints();
    const typeObjet = pointListe[compteur].isPoints;
    expect(typeObjet).toEqual(true);
  });

  it('Chaque point ajouté se connecte au précédent et créer un segment de piste.', () => {
    fakeClickEventA = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 200,
      clientY: 200
    });
    fakeClickEventB = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 400,
      clientY: 100
    });
    renderService.onMouseClick(fakeClickEventA);
    renderService.onMouseClick(fakeClickEventB);
    const longueurVecteurPoints = renderService.retournerListePoints().length;
    const longueurVecteurScene = renderService.obtenirScene().children.length;
    const vecteurLignes = renderService.pointsLine.geometry.attributes.position.array;
    const longueurVecteurLignes = vecteurLignes.length;
    let nombreDeLignes = 0;
    for ( nombreDeLignes < longueurVecteurLignes; nombreDeLignes++; ) {
      if (vecteurLignes[nombreDeLignes] === 0) {
        break;
      }
    }
    expect(longueurVecteurPoints).toEqual(2);
    expect(longueurVecteurScene).toEqual(4);
    expect(longueurVecteurLignes).toEqual(1500);
    expect(nombreDeLignes).toEqual(1);
  });





});


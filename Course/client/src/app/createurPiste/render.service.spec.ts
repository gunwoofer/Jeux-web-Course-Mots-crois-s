import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, inject, ComponentFixture, async } from '@angular/core/testing';

import { CreateurPisteComponent } from './createurPiste.component';
import { PisteValidationComponent } from './../piste/pisteValidation.component';


import { RenderService } from './render.service';

describe('RenderService', () => {

  let component: CreateurPisteComponent;
  let fixture: ComponentFixture<CreateurPisteComponent>;
  let renderService: RenderService;
  let fakeClickEvent: MouseEvent;
  const fakeClickEventArray: MouseEvent[] = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [RenderService],
      declarations: [ CreateurPisteComponent, PisteValidationComponent ],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(inject([RenderService], (service: RenderService) => {
    renderService = service;
    fixture = TestBed.createComponent(CreateurPisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

 it('should be created', () => {
    expect(renderService).toBeTruthy();
  });

  it('La zone d\'édition est initialement vide.', () => {
    const length = renderService.scene.children.length;
    expect(length).toEqual(2);
  });

  it('L\'ajout d\'un point se fait avec le bouton gauche de la souris.', () => {
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
      const longueurVecteurPoints = renderService.points.length;
      const longueurVecteurScene = renderService.scene.children.length;
      expect(longueurVecteurPoints).toEqual(1);
      expect(longueurVecteurScene).toEqual(3);
  });

  it('L\'objet ajouté au vecteur de points est de type point', () => {
    fakeClickEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    const compteur = 0;
    renderService.onMouseClick(fakeClickEvent);
    const pointListe = renderService.points;
    const typeObjet = pointListe[compteur].isPoints;
    expect(typeObjet).toEqual(true);
  });

  it('Chaque point ajouté se connecte au précédent et créer un segment de piste.', () => {
    for (let i = 0; i <= 1; i++) {
      fakeClickEventArray[i] = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: 200 + 200 * i,
        clientY: 200 - 100 * i
      });
      renderService.onMouseClick(fakeClickEventArray[i]);
    }
    const longueurVecteurPoints = renderService.points.length;
    const longueurVecteurScene = renderService.scene.children.length;
    const vecteurLignes = renderService.pointsLine.geometry.attributes.position.array;
    const longueurVecteurLignes = vecteurLignes.length;
    expect(longueurVecteurPoints).toEqual(2);
    expect(longueurVecteurScene).toEqual(4);
    expect(longueurVecteurLignes).toEqual(3000);
    expect(renderService.compteur - 1).toEqual(1);
  });

  it ('Pour clore la boucle, un point doit être ajouté sur le premier.', () => {
    fakeClickEventArray[0] = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 200,
      clientY: 200
    });
    fakeClickEventArray[1] = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 400,
      clientY: 100
    });
    fakeClickEventArray[2] = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 500,
      clientY: 200
    });
    fakeClickEventArray[3] = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 200,
      clientY: 200
    });
    for (let i = 0; i <= 3; i++) {
      renderService.onMouseClick(fakeClickEventArray[i]);
    }
    const longueurVecteurPoints = renderService.points.length;
    const premierPointX = renderService.points[0].position.x;
    const dernierPointX = renderService.points[longueurVecteurPoints - 1].position.x;
    const premierPointY = renderService.points[0].position.y;
    const dernierPointY = renderService.points[longueurVecteurPoints - 1].position.y;
    expect(longueurVecteurPoints).toEqual(4);
    expect(premierPointX).toEqual(dernierPointX);
    expect(premierPointY).toEqual(dernierPointY);
  });

  it('Le retrait du dernier point ajouté se fait avec le bouton droit de la souris.', () => {
    fakeClickEventArray[0] = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 500,
      clientY: 200
    });
    fakeClickEventArray[1] = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 700,
      clientY: 200
    });
    fakeClickEventArray[2] = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 800,
      clientY: 300
    });
    renderService.onMouseClick(fakeClickEventArray[0]);
    renderService.onMouseClick(fakeClickEventArray[1]);
    renderService.onMouseClick(fakeClickEventArray[2]);
    const premierPointX = renderService.points[0].position.x;
    const premierPointY = renderService.points[0].position.y;
    expect(renderService.points.length).toEqual(3);
    renderService.rightClick();
    expect(renderService.points.length).toEqual(2);
    expect(premierPointX).toEqual(renderService.points[0].position.x);
    expect(premierPointY).toEqual(renderService.points[0].position.y);
    expect(renderService.points[2]).toBeUndefined();
  });

  it ('Il ne peut y avoir un angle de 45 degres ou moins.', () => {
      fakeClickEventArray[0] = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 758,
      clientY: 266
    });
      fakeClickEventArray[1] = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 784,
      clientY: 170
    });
      fakeClickEventArray[2] = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 813,
      clientY: 405
    });
    for (let i = 0; i <= 2; i++) {
      renderService.onMouseClick(fakeClickEventArray[i]);
    }
    const angle = renderService.calculerAngle(1);
    expect(angle).toBeLessThanOrEqual(0.785398163);
    expect(renderService.nbAnglesPlusPetit45).toEqual(1);
  });

  it('Le premier point devra être identifié avec un contour particulier.', () => {
    for (let i = 0; i <= 4; i++) {
      fakeClickEventArray[i] = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: 758 - (i * 50),
        clientY: 266 + (i * 20)
      });
      renderService.onMouseClick(fakeClickEventArray[i]);
    }
    expect(renderService.points[0].material.color.getHex()).toEqual(0x800080);
    for (let i = 1; i <= 4; i++) {
      expect(renderService.points[i].material.color.getHex()).toEqual(0x008000);
    }
  });

  it('Le premier segment est celui sur lequel se trouve la zone de départ.', () => {
    for (let i = 0; i <= 4; i++) {
      fakeClickEventArray[i] = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: 458 - (i * 100),
        clientY: 266 + (i * 20)
      });
      renderService.onMouseClick(fakeClickEventArray[i]);
    }
    const vecteurLignes = renderService.pointsLine.geometry.attributes.position.array;
    const premierSegment = vecteurLignes[0];
    expect(renderService.obtenirLigneDeDepart()).toEqual(premierSegment);
    expect(renderService.compteur - 1).toEqual(4);
  });
});

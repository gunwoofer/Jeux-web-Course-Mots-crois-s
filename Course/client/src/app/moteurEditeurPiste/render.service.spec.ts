import { MondeDuJeuService } from './../mondedujeu/mondedujeu.service';
import { CreateurPisteService } from './../createurPiste/createurPiste.service';
import { CollisionService } from './../voiture/collision.service';
import { CalculateurNombreOngle } from './../contraintesCircuit/calculateurNombreAngle';
import { FacadePointService } from './../facadePoint/facadepoint.service';
import { FacadeCoordonneesService } from './../facadeCoordonnees/facadecoordonnees.service';
import { DeplacementService } from './../deplacement/deplacement.service';
import { AffichageTeteHauteService } from '../affichageTeteHaute/affichagetetehaute.service';
import { PlacementService } from './../objetService/placementVoiture.service';
import { LumiereService } from './../lumiere/lumiere.service';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TestBed, inject, ComponentFixture, async } from '@angular/core/testing';

import { CreateurPisteComponent } from '../createurPiste/createurPiste.component';
import { PisteValidationComponent } from '../pisteValidator/pisteValidation.component';
import { FacadeLigneService } from '../facadeLigne/facadeLigne.service';

import { MessageErreurService } from '../messageErreurs/messageerreur.service';
import { MoteurEditeurPiste } from './moteurediteurpiste.service';
import { PisteService } from '../piste/piste.service';
import { RatingService } from './../rating/rating.service';
import { SkyboxService } from './../skybox/skybox.service';
import { TableauScoreService } from '../tableauScore/tableauScoreService.service';
import { GestionnaireDeVue } from './../gestionnaireDeVue/gestionnaireDeVue.service';
import { FiltreCouleurService } from '../filtreCouleur/filtreCouleur.service';
import { ObjetService } from '../objetService/objet.service';
import { MusiqueService } from './../musique/musique.service';
import { JeuDeCourseService } from './../jeuDeCourse/jeudecourse.service';
import { EvenementService } from '../gestionnaireEvenement/gestionnaireEvenement.service';
import { SortiePisteService } from '../sortiePiste/sortiePiste.service';
describe('MoteurEditeurPiste test', () => {

    const messageErreurService = new MessageErreurService();
    let fixture: ComponentFixture<CreateurPisteComponent>;
    let renderService: MoteurEditeurPiste;
    let createurPisteService: CreateurPisteService;
    let evenementService: EvenementService;
    let fakeClickEvent: MouseEvent;
    const fakeClickEventArray: MouseEvent[] = [];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [MoteurEditeurPiste, EvenementService, PisteService, AffichageTeteHauteService,
                JeuDeCourseService, MessageErreurService, RatingService, DeplacementService,
                MusiqueService, ObjetService, LumiereService, SkyboxService, PlacementService, SortiePisteService,
                FiltreCouleurService, GestionnaireDeVue, TableauScoreService, FacadeCoordonneesService,
                FacadePointService, SortiePisteService, CollisionService, CreateurPisteService, MondeDuJeuService],
            declarations: [CreateurPisteComponent, PisteValidationComponent],
            imports: [FormsModule, HttpModule]
        })
            .compileComponents();
    }));

    beforeEach(inject([MoteurEditeurPiste, EvenementService, CreateurPisteService], (service: MoteurEditeurPiste, souris: EvenementService,
                                                            createurpiste: CreateurPisteService) => {
        renderService = service;
        evenementService = souris;
        createurPisteService = createurpiste;
        fixture = TestBed.createComponent(CreateurPisteComponent);
        fixture.detectChanges();
    }));

    it('renderService devrait être créé', () => {
        expect(renderService).toBeTruthy();
    });

    it('EvenementService devrait être créé', () => {
        expect(EvenementService).toBeTruthy();
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

        evenementService.onMouseClick(fakeClickEvent);
        expect(fakeClickEvent.button).toEqual(0);
    });

    it('Le point est crée et ajouté à la scene et le vecteur points', () => {
        fakeClickEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        evenementService.onMouseClick(fakeClickEvent);
        const longueurVecteurPoints = createurPisteService.obtenirPoints().length;
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
        evenementService.onMouseClick(fakeClickEvent);
        const pointListe = <any> createurPisteService.obtenirPoints();
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
            evenementService.onMouseClick(fakeClickEventArray[i]);
        }
        const longueurVecteurPoints = createurPisteService.obtenirPoints().length;
        const longueurVecteurScene = renderService.scene.children.length;
        const vecteurLignes = createurPisteService.pointsLine.geometry.attributes.position.array;
        const longueurVecteurLignes = vecteurLignes.length;
        expect(longueurVecteurPoints).toEqual(2);
        expect(longueurVecteurScene).toEqual(4);
        expect(longueurVecteurLignes).toEqual(3000);
        expect(renderService.facadePointService.compteur - 1).toEqual(1);
    });

    it('Pour clore la boucle, un point doit être ajouté sur le premier.', () => {
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
            evenementService.onMouseClick(fakeClickEventArray[i]);
        }
        const longueurVecteurPoints = createurPisteService.obtenirPoints().length;
        const premierPointX = createurPisteService.obtenirPoints()[0].position.x;
        const dernierPointX = createurPisteService.obtenirPoints()[longueurVecteurPoints - 1].position.x;
        const premierPointY = createurPisteService.obtenirPoints()[0].position.y;
        const dernierPointY = createurPisteService.obtenirPoints()[longueurVecteurPoints - 1].position.y;
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
        evenementService.onMouseClick(fakeClickEventArray[0]);
        evenementService.onMouseClick(fakeClickEventArray[1]);
        evenementService.onMouseClick(fakeClickEventArray[2]);
        const premierPointX = createurPisteService.obtenirPoints()[0].position.x;
        const premierPointY = createurPisteService.obtenirPoints()[0].position.y;
        expect(createurPisteService.obtenirPoints().length).toEqual(3);
        evenementService.rightClick();
        expect(createurPisteService.obtenirPoints().length).toEqual(2);
        expect(premierPointX).toEqual(createurPisteService.obtenirPoints()[0].position.x);
        expect(premierPointY).toEqual(createurPisteService.obtenirPoints()[0].position.y);
        expect(createurPisteService.obtenirPoints()[2]).toBeUndefined();
    });

    it('Il ne peut y avoir un angle de 45 degres ou moins.', () => {
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
            evenementService.onMouseClick(fakeClickEventArray[i]);
        }
        const angle = CalculateurNombreOngle.calculerAngle(1,
                                                createurPisteService.obtenirPoints(), renderService.facadePointService.compteur);
        expect(angle).toBeLessThanOrEqual(0.785398163);
        expect(createurPisteService.nbAnglesPlusPetit45).toEqual(1);
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
            evenementService.onMouseClick(fakeClickEventArray[i]);
        }
        for (let i = 1; i <= 4; i++) {
            const pointCourant: any = createurPisteService.obtenirPoints()[i];
            expect(pointCourant.material.color.getHex()).toEqual(0x008000);
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
            evenementService.onMouseClick(fakeClickEventArray[i]);
        }
        const vecteurLignes = createurPisteService.pointsLine.geometry.attributes.position.array;
        const vecteurCouleurs = createurPisteService.pointsLine.geometry.attributes.color.array;
        const premierSegmentCouleurR = vecteurCouleurs[0];
        const premierSegmentCouleurG = vecteurCouleurs[1];
        const premierSegmentCouleurB = vecteurCouleurs[2];
        expect(premierSegmentCouleurR).toBeCloseTo(0.55);
        expect(premierSegmentCouleurG).toBeCloseTo(0.91);
        expect(premierSegmentCouleurB).toBeCloseTo(0.64);
        for (let i = 0; i < 6; i++) {
            expect(FacadeLigneService.obtenirLigneDeDepart(createurPisteService.pointsLine)[i]).toEqual(vecteurLignes[i]);
        }
        expect(renderService.facadePointService.compteur - 1).toEqual(4);
    });

    it('Test de la méthode dessiner dernierPoint', () => {
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
            evenementService.onMouseClick(fakeClickEventArray[i]);
        }
        expect(createurPisteService.obtenirDessinTermine()).toBeTruthy();
        expect(createurPisteService.obtenirPoints().length).toBeGreaterThan(2);
    });

    it('Test de la méthode afficherMessageErreurs', () => {
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
            evenementService.onMouseClick(fakeClickEventArray[i]);
        }
        expect(createurPisteService.nbAnglesPlusPetit45).toEqual(1);
        expect(
            messageErreurService.afficherMessageErreurs(
                createurPisteService.nbAnglesPlusPetit45,
                createurPisteService.nbSegmentsTropProche,
                createurPisteService.nbSegmentsCroises
            )).toEqual('Angle(s) inférieurs à 45° => 1 ; ');
    });

    it('Une piste ne peut être sauvegardée si deux segments se joignant à un même point forment un angle de moins de 45 degrés.', () => {
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
        fakeClickEventArray[3] = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: 758,
            clientY: 266
        });
        for (let i = 0; i <= 3; i++) {
            evenementService.onMouseClick(fakeClickEventArray[i]);
        }
        expect(createurPisteService.nbAnglesPlusPetit45).toEqual(2);
        expect(
            messageErreurService.afficherMessageErreurs(
                createurPisteService.nbAnglesPlusPetit45,
                createurPisteService.nbSegmentsTropProche,
                createurPisteService.nbSegmentsCroises
            )).toEqual('Angle(s) inférieurs à 45° => 2 ; ');
        expect(renderService.retourneEtatDessin()).toBeFalsy();
    });

    it('Une piste ne peut être sauvegardée si deux section se croisent.', () => {
        fakeClickEventArray[0] = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: 558,
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
            clientY: 305
        });
        fakeClickEventArray[3] = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: 558,
            clientY: 166
        });
        fakeClickEventArray[4] = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: 558,
            clientY: 266
        });
        for (let i = 0; i <= 4; i++) {
            evenementService.onMouseClick(fakeClickEventArray[i]);
        }
        expect(createurPisteService.nbSegmentsCroises).toEqual(1);
        expect(
            messageErreurService.afficherMessageErreurs(
                createurPisteService.nbAnglesPlusPetit45,
                createurPisteService.nbSegmentsTropProche,
                createurPisteService.nbSegmentsCroises
            )).toEqual('Segment(s) croisé(s) => 1 ; ');
        expect(renderService.retourneEtatDessin()).toBeFalsy();
    });

    it('Une piste ne peut être sauvegardée si la longueur d\'un segment est moins de deux fois la largeur de la piste.', () => {
        fakeClickEventArray[0] = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: 300,
            clientY: 100
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
        fakeClickEventArray[3] = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: 793,
            clientY: 405
        });
        fakeClickEventArray[4] = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: 300,
            clientY: 100
        });
        for (let i = 0; i <= 4; i++) {
            evenementService.onMouseClick(fakeClickEventArray[i]);
        }
        expect(createurPisteService.nbSegmentsTropProche).toEqual(1);
        expect(
            messageErreurService.afficherMessageErreurs(
                createurPisteService.nbAnglesPlusPetit45,
                createurPisteService.nbSegmentsTropProche,
                createurPisteService.nbSegmentsCroises
            )).toEqual('Segment(s) trop proche(s) => 1 ; ');
        expect(renderService.retourneEtatDessin()).toBeFalsy();
    });
});

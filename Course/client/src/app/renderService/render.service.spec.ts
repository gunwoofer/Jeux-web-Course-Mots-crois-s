// import { HttpModule } from '@angular/http';
// import { FormsModule } from '@angular/forms';
// import { TestBed, inject, ComponentFixture, async } from '@angular/core/testing';

// import { CreateurPisteComponent } from '../createurPiste/createurPiste.component';
// import { PisteValidationComponent } from '../pisteValidator/pisteValidation.component';

// import { ContraintesCircuitService } from '../contraintesCircuit/contraintesCircuit.service';
// import { FacadeLigneService } from '../facadeLigne/facadeligne.service';
// import { FacadeSourisService } from '../facadeSouris/facadesouris.service';
// import { MessageErreurService } from '../messageErreurs/messageerreur.service';
// import { RenderService } from './render.service';
// import { PisteService } from '../piste/piste.service';
// import { RatingService } from './../rating/rating.service';
// import { SkyboxService } from './../skybox/skybox.service';
// import { TableauScoreService } from '../tableauScore/tableauScoreService.service';
// import { CameraService } from './../cameraService/cameraService.service';
// import { FiltreCouleurService } from '../filtreCouleur/filtreCouleur.service';
// import { LumiereService } from '../dayNight/dayNight.service';
// import { ObjetService } from '../objetService/objet.service';
// import { MusiqueService } from './../musique/musique.service';
// import { GenerateurPisteService } from './../generateurPiste/generateurpiste.service';

// describe('RenderService test', () => {

//     const contraintesCircuitService = new ContraintesCircuitService();
//     const messageErreurService = new MessageErreurService();
//     const facadeligne = new FacadeLigneService();
//     let component: CreateurPisteComponent;
//     let fixture: ComponentFixture<CreateurPisteComponent>;
//     let renderService: RenderService;
//     let facadeSourisService: FacadeSourisService;
//     let fakeClickEvent: MouseEvent;
//     const fakeClickEventArray: MouseEvent[] = [];

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             providers: [RenderService, FacadeSourisService, PisteService,
//                 GenerateurPisteService, MessageErreurService, RatingService,
//                 MusiqueService, ObjetService, LumiereService, SkyboxService,
//                 FiltreCouleurService, CameraService, TableauScoreService],
//             declarations: [CreateurPisteComponent, PisteValidationComponent],
//             imports: [FormsModule, HttpModule]
//         })
//             .compileComponents();
//     }));

//     beforeEach(inject([RenderService, FacadeSourisService], (service: RenderService, souris: FacadeSourisService) => {
//         renderService = service;
//         facadeSourisService = souris;
//         fixture = TestBed.createComponent(CreateurPisteComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     }));

//     it('renderService devrait être créé', () => {
//         expect(renderService).toBeTruthy();
//     });

//     it('facadeSourisService devrait être créé', () => {
//         expect(facadeSourisService).toBeTruthy();
//     });

//     it('La zone d\'édition est initialement vide.', () => {
//         const length = renderService.scene.children.length;
//         expect(length).toEqual(2);
//     });

//     it('L\'ajout d\'un point se fait avec le bouton gauche de la souris.', () => {
//         fakeClickEvent = new MouseEvent('mouseup', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//         });

//         facadeSourisService.onMouseClick(fakeClickEvent);
//         expect(fakeClickEvent.button).toEqual(0);
//     });

//     it('Le point est crée et ajouté à la scene et le vecteur points', () => {
//         fakeClickEvent = new MouseEvent('mouseup', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//         });
//         facadeSourisService.onMouseClick(fakeClickEvent);
//         const longueurVecteurPoints = renderService.points.length;
//         const longueurVecteurScene = renderService.scene.children.length;
//         expect(longueurVecteurPoints).toEqual(1);
//         expect(longueurVecteurScene).toEqual(3);
//     });

//     it('L\'objet ajouté au vecteur de points est de type point', () => {
//         fakeClickEvent = new MouseEvent('mouseup', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//         });
//         const compteur = 0;
//         facadeSourisService.onMouseClick(fakeClickEvent);
//         const pointListe = renderService.points;
//         const typeObjet = pointListe[compteur].isPoints;
//         expect(typeObjet).toEqual(true);
//     });

//     it('Chaque point ajouté se connecte au précédent et créer un segment de piste.', () => {
//         for (let i = 0; i <= 1; i++) {
//             fakeClickEventArray[i] = new MouseEvent('mouseup', {
//                 bubbles: true,
//                 cancelable: true,
//                 view: window,
//                 clientX: 200 + 200 * i,
//                 clientY: 200 - 100 * i
//             });
//             facadeSourisService.onMouseClick(fakeClickEventArray[i]);
//         }
//         const longueurVecteurPoints = renderService.points.length;
//         const longueurVecteurScene = renderService.scene.children.length;
//         const vecteurLignes = renderService.pointsLine.geometry.attributes.position.array;
//         const longueurVecteurLignes = vecteurLignes.length;
//         expect(longueurVecteurPoints).toEqual(2);
//         expect(longueurVecteurScene).toEqual(4);
//         expect(longueurVecteurLignes).toEqual(3000);
//         expect(renderService.facadePointService.compteur - 1).toEqual(1);
//     });

//     it('Pour clore la boucle, un point doit être ajouté sur le premier.', () => {
//         fakeClickEventArray[0] = new MouseEvent('mouseup', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 200,
//             clientY: 200
//         });
//         fakeClickEventArray[1] = new MouseEvent('mouseup', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 400,
//             clientY: 100
//         });
//         fakeClickEventArray[2] = new MouseEvent('mouseup', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 500,
//             clientY: 200
//         });
//         fakeClickEventArray[3] = new MouseEvent('mouseup', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 200,
//             clientY: 200
//         });
//         for (let i = 0; i <= 3; i++) {
//             facadeSourisService.onMouseClick(fakeClickEventArray[i]);
//         }
//         const longueurVecteurPoints = renderService.points.length;
//         const premierPointX = renderService.points[0].position.x;
//         const dernierPointX = renderService.points[longueurVecteurPoints - 1].position.x;
//         const premierPointY = renderService.points[0].position.y;
//         const dernierPointY = renderService.points[longueurVecteurPoints - 1].position.y;
//         expect(longueurVecteurPoints).toEqual(4);
//         expect(premierPointX).toEqual(dernierPointX);
//         expect(premierPointY).toEqual(dernierPointY);
//     });

//     it('Le retrait du dernier point ajouté se fait avec le bouton droit de la souris.', () => {
//         fakeClickEventArray[0] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 500,
//             clientY: 200
//         });
//         fakeClickEventArray[1] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 700,
//             clientY: 200
//         });
//         fakeClickEventArray[2] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 800,
//             clientY: 300
//         });
//         facadeSourisService.onMouseClick(fakeClickEventArray[0]);
//         facadeSourisService.onMouseClick(fakeClickEventArray[1]);
//         facadeSourisService.onMouseClick(fakeClickEventArray[2]);
//         const premierPointX = renderService.points[0].position.x;
//         const premierPointY = renderService.points[0].position.y;
//         expect(renderService.points.length).toEqual(3);
//         facadeSourisService.rightClick();
//         expect(renderService.points.length).toEqual(2);
//         expect(premierPointX).toEqual(renderService.points[0].position.x);
//         expect(premierPointY).toEqual(renderService.points[0].position.y);
//         expect(renderService.points[2]).toBeUndefined();
//     });

//     it('Il ne peut y avoir un angle de 45 degres ou moins.', () => {
//         fakeClickEventArray[0] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 758,
//             clientY: 266
//         });
//         fakeClickEventArray[1] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 784,
//             clientY: 170
//         });
//         fakeClickEventArray[2] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 813,
//             clientY: 405
//         });
//         for (let i = 0; i <= 2; i++) {
//             facadeSourisService.onMouseClick(fakeClickEventArray[i]);
//         }
//         const angle = contraintesCircuitService.calculerAngle(1, renderService.points, renderService.facadePointService.compteur);
//         expect(angle).toBeLessThanOrEqual(0.785398163);
//         expect(renderService.nbAnglesPlusPetit45).toEqual(1);
//     });

//     it('Le premier point devra être identifié avec un contour particulier.', () => {
//         for (let i = 0; i <= 4; i++) {
//             fakeClickEventArray[i] = new MouseEvent('click', {
//                 bubbles: true,
//                 cancelable: true,
//                 view: window,
//                 clientX: 758 - (i * 50),
//                 clientY: 266 + (i * 20)
//             });
//             facadeSourisService.onMouseClick(fakeClickEventArray[i]);
//         }
//         expect(renderService.points[0].material.color.getHex()).toEqual(0x800080);
//         for (let i = 1; i <= 4; i++) {
//             expect(renderService.points[i].material.color.getHex()).toEqual(0x008000);
//         }
//     });

//     it('Le premier segment est celui sur lequel se trouve la zone de départ.', () => {
//         for (let i = 0; i <= 4; i++) {
//             fakeClickEventArray[i] = new MouseEvent('click', {
//                 bubbles: true,
//                 cancelable: true,
//                 view: window,
//                 clientX: 458 - (i * 100),
//                 clientY: 266 + (i * 20)
//             });
//             facadeSourisService.onMouseClick(fakeClickEventArray[i]);
//         }
//         const vecteurLignes = renderService.pointsLine.geometry.attributes.position.array;
//         const vecteurCouleurs = renderService.pointsLine.geometry.attributes.color.array;
//         const premierSegmentCouleurR = vecteurCouleurs[0];
//         const premierSegmentCouleurG = vecteurCouleurs[1];
//         const premierSegmentCouleurB = vecteurCouleurs[2];
//         expect(premierSegmentCouleurR).toBeCloseTo(0.55);
//         expect(premierSegmentCouleurG).toBeCloseTo(0.91);
//         expect(premierSegmentCouleurB).toBeCloseTo(0.64);
//         for (let i = 0; i < 6; i++) {
//             expect(facadeligne.obtenirLigneDeDepart(renderService.pointsLine)[i]).toEqual(vecteurLignes[i]);
//         }
//         expect(renderService.facadePointService.compteur - 1).toEqual(4);
//     });

//     it('Test de la méthode dessiner dernierPoint', () => {
//         fakeClickEventArray[0] = new MouseEvent('mouseup', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 200,
//             clientY: 200
//         });
//         fakeClickEventArray[1] = new MouseEvent('mouseup', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 400,
//             clientY: 100
//         });
//         fakeClickEventArray[2] = new MouseEvent('mouseup', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 500,
//             clientY: 200
//         });
//         fakeClickEventArray[3] = new MouseEvent('mouseup', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 200,
//             clientY: 200
//         });
//         for (let i = 0; i <= 3; i++) {
//             facadeSourisService.onMouseClick(fakeClickEventArray[i]);
//         }
//         expect(renderService.dessinTermine).toBeTruthy();
//         expect(renderService.points.length).toBeGreaterThan(2);
//     });

//     it('Test de la méthode afficherMessageErreurs', () => {
//         fakeClickEventArray[0] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 758,
//             clientY: 266
//         });
//         fakeClickEventArray[1] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 784,
//             clientY: 170
//         });
//         fakeClickEventArray[2] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 813,
//             clientY: 405
//         });
//         for (let i = 0; i <= 2; i++) {
//             facadeSourisService.onMouseClick(fakeClickEventArray[i]);
//         }
//         expect(renderService.nbAnglesPlusPetit45).toEqual(1);
//         expect(
//             messageErreurService.afficherMessageErreurs(
//                 renderService.nbAnglesPlusPetit45,
//                 renderService.nbSegmentsTropProche,
//                 renderService.nbSegmentsCroises
//             )).toEqual('Angle(s) inférieurs à 45° => 1 ; ');
//     });

//     it('Une piste ne peut être sauvegardée si deux segments se joignant à un même point forment un angle de moins de 45 degrés.', () => {
//         fakeClickEventArray[0] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 758,
//             clientY: 266
//         });
//         fakeClickEventArray[1] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 784,
//             clientY: 170
//         });
//         fakeClickEventArray[2] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 813,
//             clientY: 405
//         });
//         fakeClickEventArray[3] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 758,
//             clientY: 266
//         });
//         for (let i = 0; i <= 3; i++) {
//             facadeSourisService.onMouseClick(fakeClickEventArray[i]);
//         }
//         expect(renderService.nbAnglesPlusPetit45).toEqual(2);
//         expect(
//             messageErreurService.afficherMessageErreurs(
//                 renderService.nbAnglesPlusPetit45,
//                 renderService.nbSegmentsTropProche,
//                 renderService.nbSegmentsCroises
//             )).toEqual('Angle(s) inférieurs à 45° => 2 ; ');
//         expect(renderService.retourneEtatDessin()).toBeFalsy();
//     });

//     it('Une piste ne peut être sauvegardée si deux section se croisent.', () => {
//         fakeClickEventArray[0] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 558,
//             clientY: 266
//         });
//         fakeClickEventArray[1] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 784,
//             clientY: 170
//         });
//         fakeClickEventArray[2] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 813,
//             clientY: 305
//         });
//         fakeClickEventArray[3] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 558,
//             clientY: 166
//         });
//         fakeClickEventArray[4] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 558,
//             clientY: 266
//         });
//         for (let i = 0; i <= 4; i++) {
//             facadeSourisService.onMouseClick(fakeClickEventArray[i]);
//         }
//         expect(renderService.nbSegmentsCroises).toEqual(1);
//         expect(
//             messageErreurService.afficherMessageErreurs(
//                 renderService.nbAnglesPlusPetit45,
//                 renderService.nbSegmentsTropProche,
//                 renderService.nbSegmentsCroises
//             )).toEqual('Segment(s) croisé(s) => 1 ; ');
//         expect(renderService.retourneEtatDessin()).toBeFalsy();
//     });

//     it('Une piste ne peut être sauvegardée si la longueur d\'un segment est moins de deux fois la largeur de la piste.', () => {
//         fakeClickEventArray[0] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 300,
//             clientY: 100
//         });
//         fakeClickEventArray[1] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 784,
//             clientY: 170
//         });
//         fakeClickEventArray[2] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 813,
//             clientY: 405
//         });
//         fakeClickEventArray[3] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 793,
//             clientY: 405
//         });
//         fakeClickEventArray[4] = new MouseEvent('click', {
//             bubbles: true,
//             cancelable: true,
//             view: window,
//             clientX: 300,
//             clientY: 100
//         });
//         for (let i = 0; i <= 4; i++) {
//             facadeSourisService.onMouseClick(fakeClickEventArray[i]);
//         }
//         expect(renderService.nbSegmentsTropProche).toEqual(1);
//         expect(
//             messageErreurService.afficherMessageErreurs(
//                 renderService.nbAnglesPlusPetit45,
//                 renderService.nbSegmentsTropProche,
//                 renderService.nbSegmentsCroises
//             )).toEqual('Segment(s) trop proche(s) => 1 ; ');
//         expect(renderService.retourneEtatDessin()).toBeFalsy();
//     });
// });


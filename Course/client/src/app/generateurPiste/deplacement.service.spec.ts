import { mockPistes } from './../piste/pistes.mock';
import { TestBed, inject, async } from '@angular/core/testing';
import { Voiture, REDUCTION_VITESSE_SORTIE_PISTE, REDUCTION_VITESSE_NID_DE_POULE } from './../voiture/Voiture';
import { DeplacementService } from './deplacement.service';
import * as THREE from 'three';

// describe('Deplacement de la voiture du joueur', () => {
//     it('La voiture a une vitesse nulle initialement', () => {
//         const tableauPiste = mockPistes;
//         const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
//         expect(voitureTest.vitesse).toEqual(0);
//     });

//     it('La vitesse de la voiture augmente quand on avance avec le moteur', () => {
//         const deplacementService = new DeplacementService();
//         const tableauPiste = mockPistes;
//         const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
//         voitureTest.vitesse = 0.5;
//         deplacementService.enAvant = true;
//         deplacementService.moteurDeplacement(voitureTest);
//         expect(voitureTest.vitesse).toBeGreaterThan(0.5);
//     });

//     it('La vitesse de la voiture ne peut pas depasser la vitesse maximale', () => {
//         const deplacementService = new DeplacementService();
//         const tableauPiste = mockPistes;
//         const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
//         voitureTest.vitesse = 1;
//         deplacementService.enAvant = true;
//         deplacementService.moteurDeplacement(voitureTest);
//         expect(voitureTest.vitesse).toEqual(1);
//     });

//     it('La vitesse de la voiture diminue quand on arrete d avancer', () => {
//         const deplacementService = new DeplacementService();
//         const tableauPiste = mockPistes;
//         const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
//         voitureTest.vitesse = 0.5;
//         deplacementService.enAvant = false;
//         deplacementService.moteurDeplacement(voitureTest);
//         expect(voitureTest.vitesse).toBeLessThan(0.5);
//     });

//     it('Une sortie de piste ralentie la voiture', () => {
//         const deplacementService = new DeplacementService();
//         const tableauPiste = mockPistes;
//         const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
//         voitureTest.vitesse = 0.5;
//         DeplacementService.reduireVitesseSortiePiste(voitureTest);
//         expect(voitureTest.vitesse).toEqual(0.5 / REDUCTION_VITESSE_SORTIE_PISTE);
//     });

//     it('Le passage sur un nid de poule ralentie la voiture', () => {
//         const deplacementService = new DeplacementService();
//         const tableauPiste = mockPistes;
//         const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
//         voitureTest.vitesse = 0.5;
//         DeplacementService.reduireVitesseNidDePoule(voitureTest);
//         expect(voitureTest.vitesse).toEqual(0.5 / REDUCTION_VITESSE_NID_DE_POULE);
//     });

// });

describe('deplacementService test', () => {

    let deplacementService: DeplacementService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [DeplacementService],
            declarations: [],
            imports: []
        })
            .compileComponents();
    }));

    beforeEach(inject([DeplacementService], (service: DeplacementService) => {
        deplacementService = service;
    }));

    it('filtreCouleur devrait être créé', () => {
        expect(deplacementService).toBeTruthy();
    });

    it('La voiture a une vitesse nulle initialement', () => {
        const tableauPiste = mockPistes;
        const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
        expect(voitureTest.vitesse).toEqual(0);
    });

    it('La vitesse de la voiture augmente quand on avance avec le moteur', () => {
        const tableauPiste = mockPistes;
        const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
        voitureTest.vitesse = 0.5;
        deplacementService.enAvant = true;
        deplacementService.moteurDeplacement(voitureTest);
        expect(voitureTest.vitesse).toBeGreaterThan(0.5);
    });

    it('La vitesse de la voiture ne peut pas depasser la vitesse maximale', () => {
        const tableauPiste = mockPistes;
        const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
        voitureTest.vitesse = 1;
        deplacementService.enAvant = true;
        deplacementService.moteurDeplacement(voitureTest);
        expect(voitureTest.vitesse).toEqual(1);
    });

    it('La vitesse de la voiture diminue quand on arrete d avancer', () => {
        const tableauPiste = mockPistes;
        const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
        voitureTest.vitesse = 0.5;
        deplacementService.enAvant = false;
        deplacementService.moteurDeplacement(voitureTest);
        expect(voitureTest.vitesse).toBeLessThan(0.5);
    });

    it('Une sortie de piste ralentie la voiture', () => {
        const tableauPiste = mockPistes;
        const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
        voitureTest.vitesse = 0.5;
        DeplacementService.reduireVitesseSortiePiste(voitureTest);
        expect(voitureTest.vitesse).toEqual(0.5 / REDUCTION_VITESSE_SORTIE_PISTE);
    });

    it('Le passage sur un nid de poule ralentie la voiture', () => {
        const tableauPiste = mockPistes;
        const voitureTest = new Voiture(new THREE.Object3D, tableauPiste[0]);
        voitureTest.vitesse = 0.5;
        DeplacementService.reduireVitesseNidDePoule(voitureTest);
        expect(voitureTest.vitesse).toEqual(0.5 / REDUCTION_VITESSE_NID_DE_POULE);
    });

});

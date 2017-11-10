import { ObjetService, LUMIERES } from './objet.service';
import { Voiture } from '../voiture/Voiture';
import { TestBed, inject, async } from '@angular/core/testing';
import * as THREE from 'three';


describe('ObjetService test', () => {

    let objetService: ObjetService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ObjetService],
            declarations: [],
            imports: []
        })
            .compileComponents();
    }));

    beforeEach(inject([ObjetService], (service: ObjetService) => {
        objetService = service;
    }));

    it('cameraService devrait être créé', () => {
        expect(objetService).toBeTruthy();
    });

    it('les element du decor sont générés et sont placé dune manière aléatoire', () => {
        const chiffre = 1000;
        let objet = new THREE.Object3D();
        const arbrePath = '../../assets/objects/arbre/tree.json';
        const arbreTexture = '../../assets/objects/arbre/tree.jpg';
        objet = objetService.chargerArbre(arbrePath, arbreTexture, chiffre);
        expect(objet).toBeTruthy();
    });

    it('creation des phares', () => {
        const chiffre = 1000;
        const nom = 'phare';
        const objet = objetService.creerPhare(nom, 1000);
        expect(objet).toBeTruthy();
        expect(objet.name).toEqual(nom);
    });

    it('ajout des phares sur un objet', () => {
        const objet = new THREE.Object3D();
        objetService.ajouterPhares(objet);
        expect(objet.children.length).toEqual(6);
    });

});

import { LumiereService } from './../lumiere/lumiere.service';
import { ObjetService } from './objet.service';
import { TestBed, inject, async } from '@angular/core/testing';
import * as THREE from 'three';


describe('ObjetService test', () => {

    let objetService: ObjetService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ObjetService, LumiereService],
            declarations: [],
            imports: []
        })
            .compileComponents();
    }));

    beforeEach(inject([ObjetService], (service: ObjetService) => {
        objetService = service;
    }));

    it('objetService devrait être créé', () => {
        expect(objetService).toBeTruthy();
    });

    it('les element du decor sont générés et sont placé dune manière aléatoire', () => {
        const chiffre = 1000;
        let objet = new THREE.Object3D();
        const arbrePath = '../../assets/objects/arbre/tree.json';
        const arbreTexture = '../../assets/objects/arbre/tree.jpg';
        objet = ObjetService.chargerArbre(arbrePath, arbreTexture, chiffre);
        expect(objet).toBeTruthy();
    });

    it('ajout des phares sur un objet', () => {
        const objet = new THREE.Object3D();
        objetService.ajouterPhares(objet);
        expect(objet.children.length).toEqual(6);
    });

});

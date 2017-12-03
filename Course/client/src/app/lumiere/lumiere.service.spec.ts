import { LumiereService } from './lumiere.service';
import { TestBed, inject, async } from '@angular/core/testing';
import * as THREE from 'three';


describe('LumiereService test', () => {

    let lumiereService: LumiereService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [LumiereService],
            declarations: [],
            imports: []
        })
            .compileComponents();
    }));

    beforeEach(inject([LumiereService], (service: LumiereService) => {
        lumiereService = service;
    }));

    it('lumiereService devrait être créé', () => {
        expect(lumiereService).toBeTruthy();
    });

    it('les lumieres hemispehere et directionnele sont ajoutés a la scene', () => {
        const scene = new THREE.Scene();
        LumiereService.ajouterLumierScene(scene);
        expect(scene.children.length).toEqual(2);
    });

    it('l alternance jour et nuit seffectue', () => {
        const scene = new THREE.Scene();
        LumiereService.ajouterLumierScene(scene);
        const lumiereDirectionnelle = scene.getChildByName('lumiereDirectionnelle');
        expect(lumiereDirectionnelle.visible).toEqual(true);
        LumiereService.modeJourNuit(event, scene);
        expect(lumiereDirectionnelle.visible).toEqual(false);
    });

    it('creation des phares', () => {
        const nom = 'phare';
        const objet = LumiereService.creerPhare(nom, 1000);
        expect(objet).toBeTruthy();
        expect(objet.name).toEqual(nom);
    });

    it('ajout des phares sur un objet', () => {
        const objet = new THREE.Object3D();
        LumiereService.ajouterPhares(objet);
        expect(objet.children.length).toEqual(6);
    });
});

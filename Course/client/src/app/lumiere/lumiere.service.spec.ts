import { LumiereService, PHARES } from './lumiere.service';
import { TestBed, inject, async } from '@angular/core/testing';
import * as THREE from 'three';

const fakeClickEvent = new KeyboardEvent('keypress', {
    key: 'n'
});


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

    it('les lumieres hemispehere et directionnele sont créees', () => {
        expect(lumiereService.lumiereDirectionnelle).toBeTruthy();
        expect(lumiereService.lumiereHemisphere).toBeTruthy();
    });

    it('les lumieres hemispehere et directionnele sont ajoutés a la scene', () => {
        const scene = new THREE.Scene();
        lumiereService.ajouterLumierScene(scene);
        expect(scene.children.length).toEqual(2);
    });

    it('l alternance jour et nuit seffectue', () => {
        const scene = new THREE.Scene();
        lumiereService.modeJourNuit(event, scene);
        expect(lumiereService.lumiereDirectionnelle.visible).toEqual(false);
        lumiereService.modeJourNuit(event, scene);
        expect(lumiereService.lumiereDirectionnelle.visible).toEqual(true);
    });
});

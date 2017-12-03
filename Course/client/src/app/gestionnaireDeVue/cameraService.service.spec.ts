import { mockPistes } from './../piste/pistes.mock';

import { Voiture } from '../voiture/Voiture';
import { GestionnaireDeVue } from './gestionnaireDeVue.service';
import { TestBed, inject, async } from '@angular/core/testing';
import * as THREE from 'three';
import { Piste } from '../piste/piste.model';

const object = new THREE.Object3D();
object.position.set(10, 20, 20);
const piste = mockPistes[0];
const voiture = new Voiture(object, piste);
const camera = new THREE.PerspectiveCamera(75, 300, 1, 6000);

const fakeClickEvent = new KeyboardEvent('keypress', {
    key: '+'
});


describe('GestionnaireDeVue test', () => {

    let gestionnaireDeVue: GestionnaireDeVue;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [GestionnaireDeVue],
            declarations: [],
            imports: []
        })
            .compileComponents();
    }));

    beforeEach(inject([GestionnaireDeVue], (service: GestionnaireDeVue) => {
        gestionnaireDeVue = service;
    }));

    it('GestionnaireDeVue devrait être créé', () => {
        expect(GestionnaireDeVue).toBeTruthy();
    });

    it('vue dessus de la camera ', () => {
        const positionZ = voiture.obtenirVoiture3D().position.z + 50;
        gestionnaireDeVue.vueDessus(camera, voiture);
        expect(camera.position.x).toEqual(voiture.obtenirVoiture3D().position.x);
        expect(camera.position.y).toEqual(voiture.obtenirVoiture3D().position.y);
        expect(camera.position.z).toEqual(positionZ);
    });

    it('vue troisieme personne de la camera de la camera ', () => {
        const cameraAvant = camera.position;
        gestionnaireDeVue.vueTroisiemePersonne(camera, voiture);
        expect(camera.up).toEqual(new THREE.Vector3(0, 0, 1));
        expect(camera.position.x !== cameraAvant.x);
        expect(camera.position.y !== cameraAvant.y);
        expect(camera.position.z !== cameraAvant.z);
    });

    it('essayer le zoom ', () => {
        let cameraAvant: any;
        cameraAvant = camera.zoom;
        gestionnaireDeVue.zoom(fakeClickEvent, camera);
        console.log(fakeClickEvent);
        expect(camera.zoom).toBeGreaterThan(cameraAvant);
    });

});
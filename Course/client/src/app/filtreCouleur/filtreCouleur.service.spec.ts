import { FiltreCouleurService } from './filtreCouleur.service';
import { Voiture } from '../voiture/Voiture';
import { TestBed, inject, async } from '@angular/core/testing';
import * as THREE from 'three';


describe('FiltreService test', () => {

    let filtreCouleurService: FiltreCouleurService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [FiltreCouleurService],
            declarations: [],
            imports: []
        })
            .compileComponents();
    }));

    beforeEach(inject([FiltreCouleurService], (service: FiltreCouleurService) => {
        filtreCouleurService = service;
    }));

    it('cameraService devrait être créé', () => {
        expect(filtreCouleurService).toBeTruthy();
    });

    it('appliquer filtre a une scene', () => {
        let objet: any; let objet2: any;
        const geometrie = new THREE.BoxGeometry( 1, 1, 1 );
        const materiel = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometrie,  materiel );
        const scene = new THREE.Scene();
        scene.add(cube);
        filtreCouleurService.appliquerFiltreScene(scene);
        objet = scene.children[0];
        objet2 = cube.material;
        expect(objet.material.color !== objet2.color);
    });
});

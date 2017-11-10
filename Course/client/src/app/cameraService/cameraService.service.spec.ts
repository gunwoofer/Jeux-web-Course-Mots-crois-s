// import { Voiture } from '../voiture/Voiture';
// import { CameraService } from './cameraService.service';
// import { HttpModule } from '@angular/http';
// import { FormsModule } from '@angular/forms';
// import { TestBed, inject, ComponentFixture, async } from '@angular/core/testing';
// import { NgModule } from '@angular/core';
// import * as THREE from 'three';

// const object = new THREE.Object3D();
// object.position.set(10, 20, 20);
// const voiture = new Voiture(object);
// const camera = new THREE.PerspectiveCamera(75, 300, 1, 6000);

// const fakeClickEvent = new KeyboardEvent('keypress', {
//     key: '+'
// });


// describe('CameraService test', () => {

//     let cameraService: CameraService;
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             providers: [CameraService],
//             declarations: [],
//             imports: []
//         })
//             .compileComponents();
//     }));

//     beforeEach(inject([CameraService], (service: CameraService) => {
//         cameraService = service;
//     }));

//     it('cameraService devrait être créé', () => {
//         expect(cameraService).toBeTruthy();
//     });

//     it('vue dessus de la camera ', () => {
//         const positionZ = voiture.obtenirVoiture3D().position.z + 50;
//         cameraService.vueDessus(camera, voiture);
//         expect(camera.position.x).toEqual(voiture.obtenirVoiture3D().position.x);
//         expect(camera.position.y).toEqual(voiture.obtenirVoiture3D().position.y);
//         expect(camera.position.z).toEqual(positionZ);
//     });

//     it('vue troisieme personne de la camera de la camera ', () => {
//         const cameraAvant = camera.position;
//         cameraService.vueTroisiemePersonne(camera, voiture);
//         expect(camera.up).toEqual(new THREE.Vector3(0, 0, 1));
//         expect(camera.position.x !== cameraAvant.x);
//         expect(camera.position.y !== cameraAvant.y);
//         expect(camera.position.z !== cameraAvant.z);
//     });

//     it('essayer le zoom ', () => {
//         let cameraAvant: any;
//         cameraAvant = camera.zoom;
//         cameraService.zoom(fakeClickEvent, camera);
//         console.log(fakeClickEvent);
//         expect(camera.zoom).toBeGreaterThan(cameraAvant);
//     });

// });

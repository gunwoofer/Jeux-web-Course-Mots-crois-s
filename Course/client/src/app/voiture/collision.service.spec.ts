import { Voiture } from './Voiture';
import { mockPistes } from './../mocks';
import { Object3D } from 'three';
import { CollisionService } from './collision.service';
import { TestBed, inject, async } from '@angular/core/testing';
import * as THREE from 'three';


const objectIA = new THREE.Object3D();
objectIA.position.set(10, 20, 20);
const piste = mockPistes[0];
const voitureIA = new Voiture(objectIA, piste);

const objectDuJoueur = new THREE.Object3D();
objectDuJoueur.position.set(10, 20, 20);
const voitureDuJoueur = new Voiture(objectDuJoueur, piste);

describe('Collision test', () => {

    let collisionService: CollisionService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [CollisionService],
            declarations: [],
            imports: []
        })
            .compileComponents();
    }));

    beforeEach(inject([CollisionService], (service: CollisionService) => {
        collisionService = service;
    }));

    it('collision devrait être créé', () => {
        expect(collisionService).toBeTruthy();
    });

    it('Une collision devrait etre detecter sil y a lieu', inject([CollisionService], (service: CollisionService) => {
        let estEnCollision: boolean;
        voitureDuJoueur.genererRayCasterCollision();
        voitureIA.genererRayCasterCollision();

        voitureDuJoueur.actualiserPositionRayCasterCollision();
        voitureIA.actualiserPositionRayCasterCollision();

        estEnCollision = service.estCollisionMock(voitureDuJoueur, voitureIA);
        expect(estEnCollision).toEqual(true);
    }));
});


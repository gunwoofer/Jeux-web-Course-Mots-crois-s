import { CollisionService } from './collision.service';
import { TestBed, inject, async } from '@angular/core/testing';

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
});


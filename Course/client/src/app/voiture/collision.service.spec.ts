import { CollisionService } from './collision.service';
import { Injectable } from '@angular/core';
import { Voiture } from '../voiture/Voiture';
import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, Response, ResponseOptions, Http, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

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


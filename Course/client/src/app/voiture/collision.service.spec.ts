import { CollisionService } from './collision.service';
import { Injectable } from '@angular/core';
import { Voiture } from '../voiture/Voiture';
import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Response, ResponseOptions, Http, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('Collision test', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [CollisionService],
                declarations: [],
                imports: []
            })
                .compileComponents();
            });
        });

 it('doit creer le service', inject([CollisionService], (service: CollisionService) => {
     expect(service).toBeTruthy();
}));

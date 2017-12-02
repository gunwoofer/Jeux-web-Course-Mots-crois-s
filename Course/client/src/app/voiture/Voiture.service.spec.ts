import { Injectable } from '@angular/core';
import { Voiture } from '../voiture/Voiture';
import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Response, ResponseOptions, Http, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('Voiture test', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [Voiture],
                declarations: [],
                imports: []
            })
                .compileComponents();
            });
        });

it('doit creer le service', inject([Voiture], (service: Voiture) => {
      expect(service).toBeTruthy();
 }));


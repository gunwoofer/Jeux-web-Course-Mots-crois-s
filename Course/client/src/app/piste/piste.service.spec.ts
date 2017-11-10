import { RatingService } from './../rating/rating.service';
import { SkyboxService } from '../skybox/skybox.service';
import { TableauScoreService } from './../tableauScore/tableauScoreService.service';
import { MusiqueService } from './../musique/musique.service';
import { CameraService } from '../cameraService/cameraService.service';
import { FiltreCouleurService } from '../filtreCouleur/filtreCouleur.service';
import { LumiereService } from '../dayNight/dayNight.service';
import { ObjetService } from '../objetService/objet.service';
import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Response, ResponseOptions, Http, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { mockPistes } from './pistes.mock';
import { GenerateurPisteService } from '../generateurPiste/generateurpiste.service';
import { PisteService } from './piste.service';

describe('pisteService test', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PisteService, CameraService, MusiqueService,
                GenerateurPisteService, FiltreCouleurService,
                ObjetService, LumiereService, TableauScoreService,
                MockBackend, SkyboxService, RatingService,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions],
                },
            ],
            imports: [HttpModule]
        });
    });

    it('doit creer le service', inject([PisteService], (service: PisteService) => {
        expect(service).toBeTruthy();
    }));

    it('doit retourner de pistes', inject([PisteService, MockBackend], (service: PisteService, backend: MockBackend) => {
        const reponse = new ResponseOptions({
            body: JSON.stringify(mockPistes)
        });
        const baseResponse = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(baseResponse)
        );
        return service.retournerListePiste().then(data => {
            expect(data).toEqual(mockPistes);
        });
    }));

    it('doit ajouter une Piste', inject([PisteService, MockBackend], (service: PisteService, backend: MockBackend) => {
        const piste = mockPistes[0];
        const reponse = new ResponseOptions({
            body: {
                message: 'La piste est sauvegardée',
                obj: piste
            }
        });
        const response = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response)
        );
        return service.ajouterPiste(mockPistes[0]).then(data => {
            expect(data).toEqual(response.json());
        });
    }));

    it('doit supprimer une Piste', inject([PisteService, MockBackend], (service: PisteService, backend: MockBackend) => {
        const piste = mockPistes[0];
        const reponse = new ResponseOptions({
            body: {
                message: 'La piste est supprimée',
                obj: piste
            }
        });
        const response = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response)
        );
        return service.supprimerListePiste(mockPistes[0]).then(data => {
            expect(data).toEqual(response.json());
        });
    }));

    it('doit modifier une Piste', inject([PisteService, MockBackend], (service: PisteService, backend: MockBackend) => {
        const piste = mockPistes[0];
        const reponse = new ResponseOptions({
            body: {
                message: 'La piste est modifiée',
                obj: piste
            }
        });
        const response = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response)
        );
        return service.mettreAjourPiste(mockPistes[0]).then(data => {
            expect(data).toEqual(response.json());
        });
    }));
});

import { mockPistes } from './../mocks';
import { CollisionService } from './../voiture/collision.service';
import { SortiePisteService } from './../sortiePiste/sortiePiste.service';
import { DeplacementService } from './../deplacement/deplacement.service';
import { GestionnaireDeVue } from './../gestionnaireDeVue/gestionnaireDeVue.service';
import { AffichageTeteHauteService } from './../affichageTeteHaute/affichagetetehaute.service';
import { PlacementService } from './../objetService/placementVoiture.service';
import { RatingService } from './../rating/rating.service';
import { SkyboxService } from '../skybox/skybox.service';
import { TableauScoreService } from './../tableauScore/tableauScoreService.service';
import { MusiqueService } from './../musique/musique.service';
import { FiltreCouleurService } from '../filtreCouleur/filtreCouleur.service';
import { ObjetService } from '../objetService/objet.service';
import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Response, ResponseOptions, Http, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { JeuDeCourseService } from '../jeuDeCourse/jeudecourse.service';
import { PisteService } from './piste.service';
import { MondeDuJeuService } from '../mondedujeu/mondedujeu.service';

describe('pisteService test', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PisteService, GestionnaireDeVue, MusiqueService, SortiePisteService,
                JeuDeCourseService, FiltreCouleurService, AffichageTeteHauteService,
                ObjetService, TableauScoreService, DeplacementService,
                MockBackend, SkyboxService, RatingService, PlacementService, CollisionService,
                BaseRequestOptions, SortiePisteService, MondeDuJeuService,
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

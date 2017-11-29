import { Piste } from './../piste/piste.model';
import { RatingService } from './rating.service';
import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Response, ResponseOptions, Http, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ElementDePiste } from '../elementsPiste/ElementDePiste';

const listepositions: any[] =
[{ z: 0, y: 24.003569616469644, x: 101.77079099777208 },
{ z: 0, y: 46.826635809178065, x: 41.17161184536442 },
{ z: 0, y: -34.23459928906337, x: 8.511015289197246 },
{ z: 0, y: -43.28512553789595, x: 99.40978401780862 },
{ z: 0, y: 24.003569616469644, x: 101.77079099777208 }];


const listeElement: ElementDePiste[] = new Array();

const pisteMock = new Piste('piste1', 'amateur', 'piste izi', listepositions, listeElement);
const rating = 5;

describe('Rating service test', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RatingService,
                MockBackend,
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

    it('Rating service est cree', inject([RatingService], (service: RatingService) => {
        expect(service).toBeTruthy();
    }));

    it('Tableau de piste est modifie ', inject([RatingService, MockBackend], (service: RatingService, backend: MockBackend) => {
        service.piste = pisteMock;
        const message = 'Le tableau de rating est modifie';
        const reponse = new ResponseOptions({
            body: JSON.stringify(message)
        });
        const response = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response)
        );
        return service.mettreAjourRating(rating).then(data => {
            expect(data).toEqual('Le tableau de rating est modifie');
        });
    }));
});

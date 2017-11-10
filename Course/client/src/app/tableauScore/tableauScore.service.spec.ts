import { mockTableauScore, pisteMock, scoreMock } from './mockTableau';
import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Response, ResponseOptions, Http, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { TableauScoreService } from './tableauScoreService.service';
describe('utilisateurService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TableauScoreService,
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

    it('doit creer le service', inject([TableauScoreService], (service: TableauScoreService) => {
        expect(service).toBeTruthy();
    }));

    it('admin sinscrit ', inject([TableauScoreService, MockBackend], (service: TableauScoreService, backend: MockBackend) => {
        const message = 'Tableau a ete modifie';
        const reponse = new ResponseOptions({
            body: JSON.stringify(message)
        });
        const response = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response)
        );
        return service.mettreAjourTableauMeilleurTemps(scoreMock).then(data => {
            expect(data).toEqual('Tableau a ete modifie');
        });
    }));
});




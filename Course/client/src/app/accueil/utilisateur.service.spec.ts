/*import { mockForm, mockListAdmin, mockAdmin } from './../mocks';
import { UtilisateurService } from './utilisateur.service';
import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Response, ResponseOptions, Http, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';



describe('utilisateurService test', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UtilisateurService,
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

    it('doit creer le service', inject([UtilisateurService], (service: UtilisateurService) => {
        expect(service).toBeTruthy();
    }));

    it('admin sinscrit ', inject([UtilisateurService, MockBackend], (service: UtilisateurService, backend: MockBackend) => {
        const admin = mockAdmin;
        const message = 'administrateur sest enregistre';
        const reponse = new ResponseOptions({
            body: JSON.stringify(message)
        });
        const response = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response)
        );
        return service.sInscrire(admin).then(data => {
            expect(<any>data).toEqual('administrateur sest enregistre');
        });
    }));

    it('retourne nombre d admin', inject([UtilisateurService, MockBackend], (service: UtilisateurService, backend: MockBackend) => {
        const nombreAdmin = mockListAdmin.length;
        const reponse = new ResponseOptions({
            body: JSON.stringify(mockListAdmin.length)
        });
        const baseResponse = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(baseResponse)
        );
        return service.nombreDAdmin().then(data => {
            expect(<any>data).toEqual(nombreAdmin);
            expect(<any>data).toEqual(1);
        });
    }));

    it('retourne mot De passe', inject([UtilisateurService, MockBackend], (service: UtilisateurService, backend: MockBackend) => {
        const reponse = new ResponseOptions({
            body: JSON.stringify(mockAdmin.obtenirMotDePasse())
        });
        const baseResponse = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(baseResponse)
        );
        return service.recupererMotDePasse(mockAdmin.obtenirEmail()).then(data => {
            expect(<any>data).toEqual(mockListAdmin[0].obtenirMotDePasse());
        });
    }));

    it('admin modifie son mot de passe', inject([UtilisateurService, MockBackend], (service: UtilisateurService, backend: MockBackend) => {
        const message = 'Le mot de passe a été modifié';
        const reponse = new ResponseOptions({
            body: JSON.stringify(message)
        });
        const response = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response)
        );
        return service.modifierMotDePasse(mockForm).then(data => {
            expect(<any>data).toEqual('Le mot de passe a été modifié');
            expect(<any>data).toEqual(message);
        });
    }));

    it('admin se connecte', inject([UtilisateurService, MockBackend], (service: UtilisateurService, backend: MockBackend) => {
        const message = 'connexion est approuve';
        const reponse = new ResponseOptions({
            body: JSON.stringify(message)
        });
        const response = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(response)
        );
        return service.modifierMotDePasse(mockForm).then(data => {
            expect(<any>data).toEqual('connexion est approuve');
            expect(<any>data).toEqual(message);
        });
    }));

});*/

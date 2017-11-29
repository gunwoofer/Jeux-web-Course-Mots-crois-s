import { mockForm, mockListAdmin, mockAdmin } from './../mocks';
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
            expect(data).toEqual('administrateur sest enregistre');
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
        return service.nombreAdmin().then(data => {
            expect(data).toEqual(nombreAdmin);
            expect(data).toEqual(1);
        });
    }));

    it('retourne mot De passe', inject([UtilisateurService, MockBackend], (service: UtilisateurService, backend: MockBackend) => {
        const reponse = new ResponseOptions({
            body: JSON.stringify(mockAdmin.motDePasse)
        });
        const baseResponse = new Response(reponse);
        backend.connections.subscribe(
            (connection: MockConnection) => connection.mockRespond(baseResponse)
        );
        return service.recupererMotDePasse(mockAdmin.email).then(data => {
            expect(data).toEqual(mockListAdmin[0].motDePasse);
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
            expect(data).toEqual('Le mot de passe a été modifié');
            expect(data).toEqual(message);
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
            expect(data).toEqual('connexion est approuve');
            expect(data).toEqual(message);
        });
    }));

});

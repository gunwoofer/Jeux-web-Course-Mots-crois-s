import { ModificationForm } from './admin/modificationMotDepasse/modificationModel';
import { Http, Response } from '@angular/http';
import { Administrateur } from './admin/admin.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()

export class UtilisateurService {

    constructor(private http: Http) { }

    public isAdmin: boolean;
    public nbAdmin: number;

    public sInscrire(admin: Administrateur): Promise<Response> {
        return this.http.post('http://localhost:3000/inscription', admin)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public nombreAdmin(): Promise<any> {
        return this.http.get('http://localhost:3000/admin')
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public recupererMotDePasse(email: string): Promise<any> {
        return this.http.get('http://localhost:3000/motDePasseOublie' + email)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public modifierMotDePasse(form: ModificationForm): Promise<any> {
        return this.http.patch('http://localhost:3000/ModifierPass', form)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public seConnecter(admin: Administrateur) {
        return this.http.post('http://localhost:3000/admin', admin)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

}

import {
    URL_INSCRIPTION, URL_ADMINISTRATION,
    URL_MOT_DE_PASSSE_OUBLIE, URL_MODIFIER_MOT_DE_PASSE, MESSAGE_ERREUR
} from './../constant';
import { ModificationForm } from './admin/modificationMotDepasse/modificationModel';
import { Http, Response } from '@angular/http';
import { Administrateur } from './admin/admin.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()

export class UtilisateurService {

    constructor(private http: Http) { }

    public isAdmin: boolean;
    public nbAdmin: number;

    public sInscrire(admin: Administrateur): Promise<any> {
        return this.http.post(URL_INSCRIPTION, admin)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch(this.gererErreur);
    }

    public nombreAdmin(): Promise<any> {
        return this.http.get(URL_ADMINISTRATION)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch(this.gererErreur);
    }

    public recupererMotDePasse(email: string): Promise<any> {
        return this.http.get(URL_MOT_DE_PASSSE_OUBLIE + email)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public modifierMotDePasse(form: ModificationForm): Promise<any> {
        return this.http.patch(URL_MODIFIER_MOT_DE_PASSE, form)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public seConnecter(admin: Administrateur): Promise<any> {
        return this.http.post(URL_ADMINISTRATION, admin)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    private gererErreur(erreur: any): Promise<any> {
        console.error(MESSAGE_ERREUR, erreur);
        return Promise.reject(erreur.message || erreur);
    }

}

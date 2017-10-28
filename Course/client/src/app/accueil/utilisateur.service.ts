import { ModificationForm } from './admin/modificationMotDepasse/modificationModel';
import { Http, Response } from '@angular/http';
import { Administrateur } from './admin/admin.model';
import { Injectable } from '@angular/core';

@Injectable()

export class UtilisateurService {

    constructor(private http: Http) { }

    public isAdmin: boolean;
    public nbAdmin: number;

    public sInscrire(admin: Administrateur): Promise<any> {
        return this.http.post('http://localhost:3000/inscription', admin)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch(this.gererErreur);
    }

    public nombreAdmin(): Promise<any> {
        return this.http.get('http://localhost:3000/admin')
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch(this.gererErreur);
    }

    public recupererMotDePasse(email: string): Promise<any> {
        return this.http.get('http://localhost:3000/motDePasseOublie' + email)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch(this.gererErreur);
    }

    public modifierMotDePasse(form: ModificationForm): Promise<any> {
        return this.http.patch('http://localhost:3000/ModifierPass', form)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch(this.gererErreur);
    }

    public seConnecter(admin: Administrateur): Promise<any> {
        return this.http.post('http://localhost:3000/admin', admin)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch(this.gererErreur);
    }

    private gererErreur(erreur: any): Promise<any> {
        console.error('Une erreur est arrivé', erreur);
        return Promise.reject(erreur.message || erreur);
    }

}
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

    public seConnecter(admin: Administrateur) { }

}

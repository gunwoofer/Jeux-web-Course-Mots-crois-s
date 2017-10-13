import { Http, Response } from '@angular/http';
import { Piste } from './piste.model';
import * as THREE from 'three';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { RenderService } from '../renderService/render.service';
import { GenerateurPisteService } from '../generateurPiste/generateurpiste.service';

@Injectable()

export class PisteService {
    private pistes: Piste[] = [];
    public pisteAEditer = new EventEmitter<Piste>();
    public pisteChoisie = new EventEmitter<Piste>();

    constructor(private renderService: RenderService, private generateurPisteService: GenerateurPisteService, private http: Http) { 
        
        this.pisteChoisie.subscribe(
            (piste: Piste) => generateurPisteService.ajouterPiste(piste)
        );
    }


    public ajouterPiste(piste: Piste): Observable<Response> {
        this.pistes.push(piste);
        return this.http.post('http://localhost:3000/createurPiste', piste)
            .map((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public retournerListePiste(): Promise<Piste[]> {
        return this.http.get('http://localhost:3000/listePiste')
            .toPromise()
            .then(response => {
                const pistes = response.json().obj;
                const pisteTemporaire: Piste[] = [];
                for (const piste of pistes) {
                    let vraiVecteur: THREE.Vector3 = new THREE.Vector3(0,0,0);
                    let vraiVecteurs: THREE.Vector3[] = new Array();
                    
                    for (let vecteur3 of piste.listepositions) {
                        Object.assign(vraiVecteur, vecteur3 as THREE.Vector3);
                        vraiVecteurs.push(vraiVecteur);
                        vraiVecteur = new THREE.Vector3(0,0,0);
                    }


                    const pist = new Piste(piste.nom, piste.typeCourse, piste.description, vraiVecteurs, piste._id);
                    pist.coteAppreciation = piste.coteAppreciation;
                    pist.nombreFoisJouee = piste.nombreFoisJouee;
                    pist.meilleursTemps = piste.meilleursTemps;

                    pist.modifieAttribut(piste.coteAppreciation, piste.nombreFoisJouee, piste.meilleursTemps);
                    pisteTemporaire.push(pist);
                }
                this.pistes = pisteTemporaire;
                return pisteTemporaire;
            });
    }

    public supprimerListePiste(piste: Piste): Promise<JSON> {
        const pist = piste.id;
        console.log(pist);
        this.pistes.splice(this.pistes.indexOf(piste), 1);
        return this.http.delete('http://localhost:3000/listePiste' + pist)
            .toPromise()
            .then(response => response.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public modifierPiste(piste: Piste): void {
        this.pisteAEditer.emit(piste);
    }

    public commencerPartie(piste: Piste) {
        this.pisteChoisie.emit(piste);
        console.log(piste);
    }

    
    public mettreAjourPiste(piste: Piste): Observable<JSON> {
        return this.http.patch('http://localhost:3000/createurPiste' + piste.id, piste)
            .map((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }
}

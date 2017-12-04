import {Component} from '@angular/core';
import {Niveau} from '../../../../commun/niveau';
import {TypePartie} from '../../../../commun/typePartie';
import {Router} from '@angular/router';
import {ChoixPartieService} from './choix-partie.service';


@Component({
    selector: 'app-choix-partie-view-component',
    templateUrl: './choix-partie-view.component.html',
    styleUrls: ['./choix-partie-view.component.css']
})

export class ChoixPartieViewComponent {
    public typePartie: TypePartie = TypePartie.classique_a_un;
    public niveauPartie: Niveau = Niveau.facile;
    public nbJoueursPartie = 0;
    public niveaux: Niveau[] = [Niveau.facile, Niveau.moyen, Niveau.difficile];
    public types: TypePartie[] = [TypePartie.classique_a_un, TypePartie.dynamique_a_un];
    public nbJoueurs: number[] = [0, 1];
    public niveauValue: string[] = ['facile', 'moyen', 'difficile'];
    public typePartieValue: string[] = ['classique', 'dynamique'];
    public nbJoueursValue: string[] = ['1 joueur', '2 joueurs'];
    public partieEnRecherche: boolean;

    constructor(private router: Router, private choixPartieService: ChoixPartieService) {
        this.partieEnRecherche = false;
        this.choixPartieService.changementDeRoute.subscribe(route => {
            this.router.navigate([route]);
        });
    }

    public ajouterTypePartie(typePartie: TypePartie): void {
        this.typePartie = typePartie;
    }

    public ajouterNiveauPartie(niveauPartie: Niveau): void {
        this.niveauPartie = niveauPartie;
    }

    public ajouterNbJoueursPartie(nbJoueurs: number): void {
        this.nbJoueursPartie = nbJoueurs;
    }

    public demanderCreationPartie() {
        if(this.nbJoueursPartie > 0) {
            this.typePartie = this.typePartie + 2;
        }
        this.choixPartieService.demanderPartie(this.niveauPartie, this.typePartie, this.nbJoueursPartie);
        this.partieEnRecherche = true;
    }

    public joindrePartieEnAttente() {
        this.router.navigate(['trouverPartie']);
    }
}

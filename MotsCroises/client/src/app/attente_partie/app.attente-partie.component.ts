import {Component} from '@angular/core';
import {GameViewService} from '../game_view/game-view.service';
import {VuePartieEnCours} from '../../../../commun/VuePartieEnCours';
import {EnumUtilitaires} from '../../../../commun/EnumUtilitaires';
import {Niveau} from '../../../../commun/Niveau';
import {SpecificationPartie} from '../../../../commun/SpecificationPartie';
import {ChoixPartieService} from '../choix_partie/choix-partie.service';


@Component({
    selector: 'app-trouver-partie-component',
    templateUrl: './attente-partie.component.html',
    styleUrls: ['./attente-partie.component.css']
})

export class AttentePartieComponent {
    public nomJoueur = '';
    public partieSelectionne: VuePartieEnCours;
    public specificationPartie: SpecificationPartie;
    public niveauPartie: string;
    public difficultePartie: string;

    constructor(private gameViewService: GameViewService, private choixPartieService: ChoixPartieService) {
        this.nomJoueur = this.choixPartieService.joueur.obtenirNomJoueur();
        this.recupererDonnesPartie();
    }

    private recupererDonnesPartie(): void {
        this.specificationPartie = this.choixPartieService.specificationPartie;
        this.niveauPartie = EnumUtilitaires.chaine_de_caractere_depuis_enum(Niveau, this.choixPartieService.specificationPartie.niveau);
        this.difficultePartie = EnumUtilitaires
            .chaine_de_caractere_depuis_enum(Niveau, this.choixPartieService.specificationPartie.typePartie);
    }

    public deuxJoueursPresents() {
        return (this.gameViewService.joueur2.obtenirNomJoueur().length === 0);
    }

    public demarrerPartie2joueurs() {
    }

}

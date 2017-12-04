import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {RequisPourModifierTempsRestant} from '../../../../commun/requis/requisPourModifierTempsRestant';
import {RequisPourObtenirTempsRestant} from '../../../../commun/requis/requisPourObtenirTempsRestant';
import {GameViewService} from './game-view.service';
import * as requetes from '../../../../commun/constantes/requetesTempsReel';


@Injectable()
export class TimerService {
    private modificationTempsCheatModeSubject = new Subject<string>();
    public modificationTempsCheatMode$ = this.modificationTempsCheatModeSubject.asObservable();
    public modificationTempsServeurEnCours = false;
    private modifierTempsRestantSubject = new Subject<number>();
    public modifierTempsRestant$ = this.modifierTempsRestantSubject.asObservable();


    constructor(private gameViewService: GameViewService) {
    }

// ****************** Gestion temps de partie ************** //

    public activerModificationTempsServeur(): void {
        this.modificationTempsServeurEnCours = true;
        this.modificationTempsCheatModeSubject.next();
    }

    public desactiverModificationTempsServeur(): void {
        this.modificationTempsServeurEnCours = false;
    }

    public modifierTempsServeur(tempsVoulu: number) {
        console.log('demande modif temps', this.gameViewService.specificationPartie, tempsVoulu);
        const requisPourModifierTempsRestant = new RequisPourModifierTempsRestant(this.gameViewService.specificationPartie.guidPartie, tempsVoulu);
        this.gameViewService.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourModifierTempsRestant>(requetes.REQUETE_SERVEUR_MODIFIER_TEMPS_RESTANT,
            requisPourModifierTempsRestant, requetes.REQUETE_CLIENT_MODIFIER_TEMPS_RESTANT_RAPPEL, this.mettreAJourTempsPartie, this);
    }

    public demanderTempsPartie(): void {
        const requisPourObtenirTempsRestant = new RequisPourObtenirTempsRestant(this.gameViewService.specificationPartie.guidPartie);
        this.gameViewService.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourObtenirTempsRestant>(
            requetes.REQUETE_SERVEUR_OBTENIR_TEMPS_RESTANT,
            requisPourObtenirTempsRestant, requetes.REQUETE_CLIENT_OBTENIR_TEMPS_RESTANT_RAPPEL,
            this.mettreAJourTempsPartie, this);
    }

    public mettreAJourTempsPartie(requisPourObtenirTempsRestant: RequisPourObtenirTempsRestant,
                                  self: TimerService): void {
        self.modifierTempsRestantSubject.next(requisPourObtenirTempsRestant.tempsRestant);
    }

}

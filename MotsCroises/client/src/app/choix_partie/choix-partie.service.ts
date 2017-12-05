import { Injectable } from '@angular/core';
import { Niveau } from '../../../../commun/niveau';
import { TypePartie } from '../../../../commun/typePartie';
import { SpecificationPartie } from '../../../../commun/specificationPartie';
import { ATTENTE_PARTIE } from '../app.component';
import { Subject } from 'rxjs/Subject';
import { VuePartieEnCours } from '../../../../commun/vuePartieEnCours';
import { RequisDemandeListePartieEnAttente } from '../../../../commun/requis/requisDemandeListePartieEnAttente';
import { COULEUR_JOUEUR1, COULEUR_JOUEUR2, Joueur } from '../../../../commun/joueur';
import { RequisPourJoindrePartieMultijoueur } from '../../../../commun/requis/requisPourJoindrePartieMultijoueur';
import * as requetes from '../../../../commun/constantes/requetesTempsReel';
import { ConnexionTempsReelClientService } from '../connexion_temps_reel/connexionTempsReelClientService';

@Injectable()
export class ChoixPartieService {

    public specificationPartie: SpecificationPartie;
    public typePartie: TypePartie;
    public niveauPartie: Niveau;
    public joueur: Joueur = new Joueur(COULEUR_JOUEUR1);
    public joueur2: Joueur = new Joueur(COULEUR_JOUEUR2, '');
    public changementDeRouteSubject = new Subject<string>();
    public changementDeRoute = this.changementDeRouteSubject.asObservable();

    private nbJoueursPartie: number;
    private listeVuePartie: VuePartieEnCours[];
    private requisDemandeListePartieEnCours: RequisDemandeListePartieEnAttente;
    private requisPourJoindrePartieMultijoueur: RequisPourJoindrePartieMultijoueur;

    constructor(private connexionTempsReelClientService: ConnexionTempsReelClientService) {
        this.requisDemandeListePartieEnCours = new RequisDemandeListePartieEnAttente();
    }

    public demanderPartie(niveau: Niveau, typePartie: TypePartie, nbJoueursPartie: number): void {
        this.nbJoueursPartie = nbJoueursPartie;
        this.niveauPartie = niveau;
        this.typePartie = typePartie;
        this.specificationPartie = new SpecificationPartie(niveau, this.joueur, typePartie);
        this.demanderPartieServer();
    }

    public demanderPartieServer(): void {
        switch (this.nbJoueursPartie) {
            case 0 :
                this.connexionTempsReelClientService.connexionTempsReelClient.envoyerRecevoirRequete<SpecificationPartie>(
                                                                requetes.REQUETE_SERVEUR_CREER_PARTIE_SOLO,
                                                                this.specificationPartie,
                                                                requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO,
                                                                this.recupererPartie, this);
                break;
            case 1 :
                if (this.demanderNomJoueur()) {
                    this.connexionTempsReelClientService.connexionTempsReelClient.envoyerRecevoirRequete<SpecificationPartie>(
                        requetes.REQUETE_SERVEUR_CREER_PARTIE_MULTIJOUEUR,
                        this.specificationPartie, requetes.REQUETE_SERVEUR_CREER_PARTIE_MULTIJOUEUR_RAPPEL, this.recupererPartie, this);
                    this.ecouterRetourRejoindrePartieMultijoueur();
                }
                break;
        }
    }

    public recupererPartie(specificationPartie: SpecificationPartie, self: ChoixPartieService): void {
        self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);
        self.partieCreeeRedirection();
    }

    public demarrerPartie(): void {
        this.changementDeRouteSubject.next(this.obtenirRoutePartie());
    }

    public partieCreeeRedirection(): void {
        if (this.nbJoueursPartie === 0) {
            this.demarrerPartie();
        } else {
            this.changementDeRouteSubject.next(ATTENTE_PARTIE);
        }
    }

    public demanderListePartieEnAttente(listeVuePartie: VuePartieEnCours[]): void {
        this.listeVuePartie = listeVuePartie;
        this.connexionTempsReelClientService.connexionTempsReelClient.envoyerRecevoirRequete<RequisDemandeListePartieEnAttente>(
            requetes.REQUETE_SERVEUR_DEMANDE_LISTE_PARTIES_EN_COURS,
            this.requisDemandeListePartieEnCours, requetes.REQUETE_CLIENT_DEMANDE_LISTE_PARTIES_EN_COURS_RAPPEL,
            this.rappelDemanderListePartieEnAttente, this);
    }

    public rappelDemanderListePartieEnAttente(requisDemandeListePartieEnCours: RequisDemandeListePartieEnAttente,
                                            self: ChoixPartieService): void {
        for (const vuePartieCourante of requisDemandeListePartieEnCours.listePartie) {
            self.listeVuePartie.push(vuePartieCourante);
        }
    }

    public rejoindrePartieMultijoueur(partieChoisie: VuePartieEnCours, joueurAJoindre: Joueur): void {
        this.requisPourJoindrePartieMultijoueur = new RequisPourJoindrePartieMultijoueur(partieChoisie.guidPartie, joueurAJoindre);
        this.connexionTempsReelClientService.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourJoindrePartieMultijoueur>(
            requetes.REQUETE_SERVEUR_JOINDRE_PARTIE,
            this.requisPourJoindrePartieMultijoueur, requetes.REQUETE_SERVEUR_JOINDRE_PARTIE_RAPPEL,
            this.rappelRejoindrePartieMultijoueur, this);
    }

    public ecouterRetourRejoindrePartieMultijoueur(): void {
        this.connexionTempsReelClientService.connexionTempsReelClient.ecouterRequete(
            requetes.REQUETE_SERVEUR_JOINDRE_PARTIE_RAPPEL, this.rappelRejoindrePartieMultijoueur, this
        );
    }

    public rappelRejoindrePartieMultijoueur(requisPourJoindrePartieMultijoueur: RequisPourJoindrePartieMultijoueur,
                                            self: ChoixPartieService): void {
        requisPourJoindrePartieMultijoueur = RequisPourJoindrePartieMultijoueur.rehydrater(requisPourJoindrePartieMultijoueur);
        self.trouverJoueurAdverse(requisPourJoindrePartieMultijoueur);
        self.demarrerPartieMultijoueur(requisPourJoindrePartieMultijoueur.specificationPartie, self);
    }

    public trouverJoueurAdverse(requisPourJoindrePartieMultijoueur: RequisPourJoindrePartieMultijoueur): void {
        for (const joueurCourant of requisPourJoindrePartieMultijoueur.joueurs) {
            if (joueurCourant.obtenirGuid() !== this.joueur.obtenirGuid()) {
                joueurCourant.changerCouleur(COULEUR_JOUEUR2);
                this.joueur2 = joueurCourant;
            }
        }
    }

    public demarrerPartieMultijoueur(specificationPartie: SpecificationPartie, self: ChoixPartieService): void {
        self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);
        self.nbJoueursPartie = 1;
        self.demarrerPartie();
    }

    public obtenirRoutePartie(): string {
        return '/partie/' + this.specificationPartie.typePartie + '/' + this.specificationPartie.niveau + '/' + this.nbJoueursPartie;
    }

    private demanderNomJoueur(): boolean {
        const playerName = prompt('Veuillez entrer votre nom: ', '');
        if (playerName !== null && playerName !== '') {
            this.joueur.changerNomJoueur(playerName);
            return true;
        }
        return false;
    }
}

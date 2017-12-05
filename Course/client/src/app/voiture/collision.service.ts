import { Voiture } from './Voiture';
import { Injectable } from '@angular/core';

@Injectable()
export class CollisionService {

    public gererCollision(voitureDuJoueur: Voiture, voituresIA: Voiture[]): void  {
        const voitures = this.chargementVoituresPourCollision(voitureDuJoueur, voituresIA);
        if (voitures.length === 0) {
            return;
        }
        this.mettreAJourRaycasterSurChaqueVoiture(voitures);

        for (const voitureQuiCauseImpact of voitures) {
            const autresVoitures = this.obtenirAutresVoitures(voitureQuiCauseImpact, voitures);
            this.parcoursDesVoituresPourDetecterCollision(autresVoitures, voitureQuiCauseImpact);
        }
    }

    private parcoursDesVoituresPourDetecterCollision(autresVoitures: Voiture[], voitureQuiCauseImpact: Voiture): void {
        for (const voitureQuiRecoitImpact of autresVoitures) {
            if (this.estEnCollision(voitureQuiRecoitImpact, voitureQuiCauseImpact)) {
                this.reactionCollision(voitureQuiRecoitImpact, voitureQuiCauseImpact);
            }
        }
    }

    public estCollisionMock(voitureQuiRecoitImpact: Voiture, voitureQuiCauseImpact: Voiture): boolean {
        if (voitureQuiRecoitImpact.obtenirPosition() === voitureQuiRecoitImpact.obtenirPosition()) {
            return true;
        }
        return false;
    }

    private estEnCollision(voitureQuiRecoitImpact: Voiture, voitureQuiCauseImpact: Voiture): boolean {
        if (voitureQuiCauseImpact.raycasterCollisionDroit.intersectObject(voitureQuiRecoitImpact.obtenirVoiture3D(), true).length !== 0) {
            return true;
        }
        if (voitureQuiCauseImpact.raycasterCollisionGauche.intersectObject(voitureQuiRecoitImpact.obtenirVoiture3D(), true).length !== 0) {
            return true;
        } else {
            return false;
        }
    }

    public reactionCollision(voitureQuiRecoitImpact: Voiture, voitureQuiCauseImpact: Voiture): void {
        voitureQuiRecoitImpact.reactionDeVoitureQuiRecoitImpact(voitureQuiCauseImpact);
        voitureQuiCauseImpact.reactionVoitureQuiCauseImpact();
    }

    private chargementVoituresPourCollision(voiture: Voiture, voitures: Voiture[]): Voiture[] {
        const toutesLesVoitures: Voiture[] = new Array();
        toutesLesVoitures.push(voiture);
        for (const voitureActuelle of voitures) {
            toutesLesVoitures.push(voitureActuelle);
        }
        return toutesLesVoitures;
    }

    private obtenirAutresVoitures(voitureActuelle: Voiture, voitures: Voiture[]): Voiture[] {
        const autresVoitures: Voiture[] = [];
        for ( let i = 0; i < voitures.length; i++) {
        if (voitureActuelle.guid !== voitures[i].guid) {
                autresVoitures.push(voitures[i]);
          }
        }
        return autresVoitures;
    }

    private mettreAJourRaycasterSurChaqueVoiture(voitures: Voiture[]): void {
        for (const voiture of voitures) {
            if (voiture) {
                voiture.actualiserPositionRayCasterCollision();
            }
        }
    }
}

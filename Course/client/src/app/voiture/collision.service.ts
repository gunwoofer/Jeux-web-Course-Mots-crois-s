import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Voiture } from '../voiture/Voiture';


@Injectable()
export class CollisionService {

    public obtenirAutresVoitures(voitureActuelle: Voiture, voitures: Voiture[]): Voiture[] {
        const autresVoitures: Voiture[] = [];
        for ( let i = 0; i < voitures.length; i++) {
        if (voitureActuelle.guid !== voitures[i].guid) {
                autresVoitures.push(voitures[i]);
          }
        }
        return autresVoitures;
    }

    public mettreAJourRaycasterSurChaqueVoiture(voitures: Voiture[]): void {
        for (const voiture of voitures) {
            if (voiture) {
                voiture.actualiserPositionRayCasterCollision();
            }
        }
    }

    public analyserCollision(voitures: Voiture[]): void  {
        if (voitures.length === 0) {
            return;
        }
        let autresVoitures: Voiture[];
        this.mettreAJourRaycasterSurChaqueVoiture(voitures);
        for (const voitureQuiCauseImpact of voitures) {
            autresVoitures = this.obtenirAutresVoitures(voitureQuiCauseImpact, voitures);
           for (const voitureQuiRecoitImpact of autresVoitures) {
               if (voitureQuiCauseImpact.raycasterCollisionDroit
                .intersectObject(voitureQuiRecoitImpact.obtenirVoiture3D(), true).length !== 0
                 || voitureQuiCauseImpact.raycasterCollisionDroit
                 .intersectObject(voitureQuiRecoitImpact.obtenirVoiture3D(), true).length !== 0) {
                 voitureQuiRecoitImpact.reactionDeVoitureQuiRecoitImpact(voitureQuiCauseImpact);
                 voitureQuiCauseImpact.reactionVoitureQuiCauseImpact();
                }
            }
        }
    }


}

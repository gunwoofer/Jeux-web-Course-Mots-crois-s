import { DISTANCE_POSITIONNEMENT_PARALLELE, DISTANCE_POSITIONNEMENT_ORTHOGONALE } from './../constant';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class PlacementService {
    public calculPositionCentreZoneDepart(premierSegment: Array<THREE.Vector3>): THREE.Vector2 {
        const centreSegmentGaucheX = ((premierSegment[1].x) + premierSegment[0].x) / 2 ;
        const centreSegmentGaucheY = ((premierSegment[0].y) + premierSegment[1].y) / 2;
        const centreSegmentDroiteX = ((premierSegment[3].x) + premierSegment[2].x) / 2;
        const centreSegmentDroiteY = ((premierSegment[2].y) + premierSegment[3].y) / 2;
        const centreSegmentX = (centreSegmentGaucheX + centreSegmentDroiteX) / 2;
        const centreSegmentY = (centreSegmentGaucheY + centreSegmentDroiteY) / 2;
        return new THREE.Vector2(centreSegmentX, centreSegmentY);
    }

    public calculPositionVoiture(cadranX: number, cadranY: number, premierSegment: Array<THREE.Vector3>): THREE.Vector2 {
        const vecteurAvanceSensPiste = new THREE.Vector2().copy(this.obtenirVecteurAvanceSensPiste(premierSegment));
        vecteurAvanceSensPiste.multiplyScalar(DISTANCE_POSITIONNEMENT_PARALLELE * cadranX);
        const vecteurAvanceSensOrthogonal = new THREE.Vector2().copy(this.obtenirVecteursSensPiste(premierSegment));
        vecteurAvanceSensOrthogonal.multiplyScalar(DISTANCE_POSITIONNEMENT_ORTHOGONALE * cadranY);
        return new THREE.Vector2().copy(this.calculPositionCentreZoneDepart(premierSegment)).
        add(vecteurAvanceSensPiste).
        add(vecteurAvanceSensOrthogonal);
    }

    public obtenirVecteursSensPiste(premierSegment: Array<THREE.Vector3>): THREE.Vector2 {
        const vecteurSensPiste = this.obtenirVecteurAvanceSensPiste(premierSegment);
        return new THREE.Vector2(-vecteurSensPiste.y, vecteurSensPiste.x);
    }

    public obtenirVecteurAvanceSensPiste(premierSegment: Array<THREE.Vector3>): THREE.Vector2 {
        return new THREE.Vector2(
            (premierSegment[1].x - premierSegment[0].x), (premierSegment[1].y - premierSegment[0].y)).normalize();
    }
}

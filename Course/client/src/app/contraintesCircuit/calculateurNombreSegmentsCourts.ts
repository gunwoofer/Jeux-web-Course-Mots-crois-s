import { LARGEUR_PISTE_EDITEUR } from './../constant';
import * as THREE from 'three';

export class CalculateurNombreSegmentsCourts {

    public nombreSegmentsTropCourts(points: any[]): number {
        const largeurPiste = LARGEUR_PISTE_EDITEUR;
        let segmentTropCourt = 0;
        for (let point = 0; point < points.length - 1; point++) {
            const tailleSegment = points[point].position.distanceTo(points[point + 1].position);
            if (tailleSegment < 2 * largeurPiste) {
                segmentTropCourt++;
                points[point].material.status = 'proche';
                points[point + 1].material.status = 'proche';
            }
        }
        return segmentTropCourt;
    }
}

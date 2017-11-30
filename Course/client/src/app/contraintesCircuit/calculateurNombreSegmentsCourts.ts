import { LARGEUR_PISTE_EDITEUR } from './../constant';
import { PointsFacade } from '../pointsFacade';
import * as THREE from 'three';

export class CalculateurNombreSegmentsCourts {

    public nombreSegmentsTropCourts(points: PointsFacade[]): number {
        let segmentTropCourt = 0;

        for (let point = 0; point < points.length - 1; point++) {
            const tailleSegment = points[point].position.distanceTo(points[point + 1].position);
            if (tailleSegment < 2 * LARGEUR_PISTE_EDITEUR) {
                segmentTropCourt++;
                points[point].status = 'proche';
                points[point + 1].status = 'proche';
            }
        }
        return segmentTropCourt;
    }
}

import * as THREE from 'three';
import { PI_SUR_4 } from '../constant';
import { PointsFacade } from '../pointsFacade';

export class CalculateurNombreOngle {

    public static nombreAnglesMoins45(points: PointsFacade[], compteur: number, dessinTermine: boolean): number {
        let nbAnglesMoins45 = 0;

        for (let i = 1; i < points.length - 1; i++) {
            if (this.estUnAngleMoins45(i, points, compteur)) {
                nbAnglesMoins45++;
            }
        }

        if (dessinTermine) {
            if (this.estUnAngleMoins45(0, points, compteur)) {
                nbAnglesMoins45++;
            }
        }

        return nbAnglesMoins45;
    }

    public static calculerAngle(numeroPoint: number, points: PointsFacade[], compteur: number): number {
        if (points.length > 1) {
            return Math.acos(this.creationVecteurCourant(numeroPoint, points, compteur)
                        .dot(this.creationVecteurPrecedent(numeroPoint, points, compteur)));
        }

        return NaN;
    }

    private static estUnAngleMoins45(numeroPoint: number, points: PointsFacade[], compteur: number): boolean {
        if (points.length > 1) {
            const angle = this.calculerAngle(numeroPoint, points, compteur);

            if (angle <= PI_SUR_4) {
                return true;
            }
        }

        return false;
    }

    private static creationVecteurCourant(numeroPoint: number, points: any[], compteur?: number): THREE.Vector2 {
        return new THREE.Vector2(this.positionXVecteurCourant(numeroPoint, points),
            this.positionYVecteurCourant(numeroPoint, points)).normalize();
    }

    private static creationVecteurPrecedent(numeroPoint: number, points: any[], compteur?: number): THREE.Vector2 {
        return new THREE.Vector2(this.positionXVecteurPrecedent(numeroPoint, points, compteur),
            this.positionYVecteurPrecedent(numeroPoint, points, compteur)).normalize();
    }

    private static positionXVecteurCourant(numeroPoint: number, points: PointsFacade[]): number {
        return points[numeroPoint + 1].position.x - points[numeroPoint].position.x;
    }

    private static positionYVecteurCourant(numeroPoint: number, points: PointsFacade[]): number {
        return points[numeroPoint + 1].position.y - points[numeroPoint].position.y;
    }

    private static positionXVecteurPrecedent(numeroPoint: number, points: PointsFacade[], compteur: number): number {
        return -(points[numeroPoint].position.x - points[this.indexVecteurPrecedent(numeroPoint, compteur)].position.x);
    }

    private static positionYVecteurPrecedent(numeroPoint: number, points: PointsFacade[], compteur: number): number {
        return -(points[numeroPoint].position.y - points[this.indexVecteurPrecedent(numeroPoint, compteur)].position.y);
    }

    private static indexVecteurPrecedent(numeroPoint: number, compteur: number): number {
        return (numeroPoint === 0) ? compteur - 1 : numeroPoint - 1;
    }
}

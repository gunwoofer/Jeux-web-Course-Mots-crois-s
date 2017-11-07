import { Voiture } from './../voiture/Voiture';
import * as THREE from 'three';

export const avancer = 'w';
export const reculer = 's';
export const gauche = 'a';
export const droite = 'd';
export const changerVue = 'c';

export class Deplacement {

    private toucheAppuyer: string[] = new Array(3);

    public deplacementVoiture(event, voiture3D: THREE.Object3D, touche: number, touchePrecedente: number, voiture: Voiture): void {
        if (event.key === avancer) {
            voiture3D.translateX(voiture.vitesse);
            this.toucheAppuyer[1] = this.toucheAppuyer[1];
            this.toucheAppuyer[0] = avancer;
            if (this.toucheAppuyer[1] === gauche) {
                voiture3D.rotateY(0.01);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = gauche;
                event.keyCode = gauche;
            }
            if (this.toucheAppuyer[1] === droite) {
                voiture3D.rotateY(-0.01);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = droite;
            }
        }
        if (event.keyCode === gauche) {
            this.toucheAppuyer[1] = this.toucheAppuyer[0];
            this.toucheAppuyer[0] = gauche ;
            voiture3D.rotateY(0.05);
            if (this.toucheAppuyer[1] === avancer) {
                voiture3D.translateX(1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = avancer;
            }
            if (this.toucheAppuyer[1] === reculer) {
                voiture3D.translateX(-1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = reculer;
            }
        }
        if (event.keyCode === droite ) {
            this.toucheAppuyer[1] = this.toucheAppuyer[0];
            this.toucheAppuyer[0] = droite;
            voiture3D.rotateY(-0.05);
            if (this.toucheAppuyer[1] === avancer) {
                voiture3D.translateX(1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = avancer;
            }
            if (this.toucheAppuyer[1] === reculer) {
                voiture3D.translateX(-1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = reculer;
            }
        }
        voiture.bougerVoiture(voiture3D.position.x, voiture3D.position.y);
    }

    public toucheRelachee(event, touche: number): void {
        if (event.key === 'w' ||
            event.key === 'a' ||
            event.key === 's' ||
            event.key === 'd') {
            touche = 0;
        }
    }

        /*if (event.keyCode === reculer) {
            voiture3D.translateX(-voiture.vitesse);
            this.toucheAppuyer[1] = this.toucheAppuyer[0];
            this.toucheAppuyer[0] = reculer;
            if (this.toucheAppuyer[1] === gauche) {
                voiture3D.rotateY(-0.05);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = gauche;
            }
            if (this.toucheAppuyer[1] === droite) {
                voiture3D.rotateY(0.05);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = droite;
            }
        }*/
}

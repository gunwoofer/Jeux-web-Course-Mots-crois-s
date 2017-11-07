import { Voiture } from './../voiture/Voiture';
import * as THREE from 'three';

export const avancer = 119;
export const reculer = 115;
export const gauche = 97;
export const droite = 100;
export const changerVue = 99;

export class Deplacement {

    private toucheAppuyer: number[] = new Array(3);

    public deplacementVoiture(event, voiture3D: THREE.Object3D, touche: number, touchePrecedente: number, voiture: Voiture): void {
        if (event.keyCode === avancer) {
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
        if (event.keyCode === reculer) {
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

        if (event.keyCode === changerVue) {
            voiture.vueDessusTroisieme = !voiture.vueDessusTroisieme;
        }

    }

    public toucheRelachee(event, touche: number): void {
        if (event.keyCode === 87) {
            touche = 0;
        }
        if (event.keyCode === 83) {
            touche = 0;
        }
        if (event.keyCode === 65) {
            touche = 0;
        }
        if (event.keyCode === 68) {
            touche = 0;
        }

    }
}

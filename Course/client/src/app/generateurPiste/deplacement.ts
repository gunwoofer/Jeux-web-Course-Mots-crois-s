import * as THREE from 'three';

export const avancer = 119;
export const reculer = 115;
export const gauche = 97;
export const droite = 100;

export class Deplacement {

    private toucheAppuyer: number[] = new Array(3);

    public deplacementVoiture(event, voiture: THREE.Object3D, touche: number, touchePrecedente: number, vitesse: number): void {
        if (event.keyCode === avancer) {
            voiture.translateY(vitesse);
            this.toucheAppuyer[1] = this.toucheAppuyer[1];
            this.toucheAppuyer[0] = avancer;
            if (this.toucheAppuyer[1] === gauche) {
                voiture.rotateZ(0.01);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = gauche;
                event.keyCode = gauche;
            }
            if (this.toucheAppuyer[1] === droite) {
                voiture.rotateZ(-0.01);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = droite;
            }
        }
        if (event.keyCode === reculer) {
            voiture.translateY(-vitesse);
            this.toucheAppuyer[1] = this.toucheAppuyer[0];
            this.toucheAppuyer[0] = reculer;
           if (this.toucheAppuyer[1] === gauche) {
                voiture.rotateZ(-0.05);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = gauche;
            }
            if (this.toucheAppuyer[1] === droite) {
                voiture.rotateZ(0.05);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = droite;
            }
        }
        if (event.keyCode === gauche) {
            this.toucheAppuyer[1] = this.toucheAppuyer[0];
            this.toucheAppuyer[0] = gauche ;
            voiture.rotateZ(0.05);
            if (this.toucheAppuyer[1] === avancer) {
                voiture.translateY(1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = avancer;
            }
            if (this.toucheAppuyer[1] === reculer) {
                voiture.translateY(-1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = reculer;
            }
        }
        if (event.keyCode === droite ) {
            this.toucheAppuyer[1] = this.toucheAppuyer[0];
            this.toucheAppuyer[0] = droite;
            voiture.rotateZ(-0.05);
            if (this.toucheAppuyer[1] === avancer) {
                voiture.translateY(1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = avancer;
            }
            if (this.toucheAppuyer[1] === reculer) {
                voiture.translateY(-1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = reculer;
            }
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

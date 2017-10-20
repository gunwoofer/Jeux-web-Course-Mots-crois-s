import * as THREE from 'three';

export const Avancer = 119;
export const Reculer = 115;
export const Gauche = 97;
export const Droite = 100;

export class Deplacement {

    private toucheAppuyer: number[] = new Array(3);
    private toucheRelacher: number[] = new Array(3);

    public deplacementVoiture(event, voiture: THREE.Mesh, touche: number, touchePrecedente: number, vitesse: number): void {
        if (event.keyCode === Avancer) {
            voiture.translateY(vitesse);
            this.toucheAppuyer[1] = this.toucheAppuyer[1];
            this.toucheAppuyer[0] = Avancer;
            if (this.toucheAppuyer[1] === Gauche) {
                voiture.rotateZ(0.01)
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = Gauche;
                event.keyCode = Gauche;

            }
            if (this.toucheAppuyer[1] === Droite) {
                voiture.rotateZ(-0.01);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = Droite;
            }
        }
        if (event.keyCode === Reculer) {
            voiture.translateY(-vitesse);
            this.toucheAppuyer[1] = this.toucheAppuyer[0];
            this.toucheAppuyer[0] = Reculer;
            if (this.toucheAppuyer[1] === Gauche) {
                voiture.rotateZ(-0.05);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = Gauche;
            }
            if (this.toucheAppuyer[1] === Droite) {
                voiture.rotateZ(0.05);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = Droite;
            }
        }
        if (event.keyCode === Gauche) {
            this.toucheAppuyer[1] = this.toucheAppuyer[0];
            this.toucheAppuyer[0] = Gauche;
            voiture.rotateZ(0.05);
            if (this.toucheAppuyer[1] === Avancer) {
                voiture.translateY(1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = Avancer;
            }
            if (this.toucheAppuyer[1] === Reculer) {
                voiture.translateY(-1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = Reculer;
            }
        }
        if (event.keyCode === Droite) {
            this.toucheAppuyer[1] = this.toucheAppuyer[0];
            this.toucheAppuyer[0] = Droite;
            voiture.rotateZ(-0.05);
            if (this.toucheAppuyer[1] === Avancer) {
                voiture.translateY(1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = Avancer;

            }
            if (this.toucheAppuyer[1] === Reculer) {
                voiture.translateY(-1);
                this.toucheAppuyer[1] = this.toucheAppuyer[0];
                this.toucheAppuyer[0] = Reculer;
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

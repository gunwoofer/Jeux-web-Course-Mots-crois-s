import { Voiture } from './../voiture/Voiture';
import * as THREE from 'three';

const avancer = 'w';
const reculer = 's';
const gauche = 'a';
const droite = 'd';
const changerVue = 'c';
const rotation = 0.1;

export class Deplacement {

    private touchePressee: string[] = new Array(3);
    private enAvant: boolean;

    public deplacementVoiture(event, voiture3D: THREE.Object3D, voiture: Voiture): void {
        if (event.key === avancer) {
            console.log('TOUCHE AVANCER APPUYEE');
            this.enAvant = true;
            /*
            voiture3D.translateX(voiture.vitesse);
            this.touchePressee[0] = avancer;
            // this.touchePressee[1] = this.touchePressee[1];
            if (this.touchePressee[1] === gauche) {
                voiture3D.rotateY(0.01);
                this.touchePressee[1] = this.touchePressee[0];
                this.touchePressee[0] = gauche;
                event.keyCode = gauche;
            }
            if (this.touchePressee[1] === droite) {
                voiture3D.rotateY(-0.01);
                this.touchePressee[1] = this.touchePressee[0];
                this.touchePressee[0] = droite;
            }
            */
        }
        if (event.key === 'a' && this.enAvant) {
            console.log('tourne à gauche !');
            /*
            this.touchePressee[1] = this.touchePressee[0];
            this.touchePressee[0] = gauche ;
            voiture3D.rotateY(0.05);
            if (this.touchePressee[1] === avancer) {
                voiture3D.translateX(1);
                this.touchePressee[1] = this.touchePressee[0];
                this.touchePressee[0] = avancer;
            }
            */
        }
        if (event.key === 'd' && this.enAvant) {
            console.log('tourne à droite !');
            /*
            this.touchePressee[1] = this.touchePressee[0];
            this.touchePressee[0] = droite;
            voiture3D.rotateY(-0.05);
            if (this.touchePressee[1] === avancer) {
                voiture3D.translateX(1);
                this.touchePressee[1] = this.touchePressee[0];
                this.touchePressee[0] = avancer;
            }
            */
        }
        voiture.bougerVoiture(voiture3D.position.x, voiture3D.position.y);
    }

    public toucheRelachee(event): void {
        if (event.key === avancer) {
            console.log('Freinage...');
            console.log(this.enAvant);
            console.log('TOUCHE AVANCER LACHEE');
            this.enAvant = false;
            console.log(this.enAvant);
        }
    }
}

import { Guid } from './../Guid';
import { MotComplet } from './../../server/app/MotComplet';


export class RequisPourMotsComplets {
        public listeMotComplet: MotComplet[] = new Array();
        public guidPartie: string;

        constructor (guidpartie: string) {
            this.guidPartie = guidpartie;
        }
        public remplirListeMotComplets(liste: MotComplet[]) {
            this.listeMotComplet = liste;
        }
}
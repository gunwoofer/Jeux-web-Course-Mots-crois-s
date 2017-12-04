import { MotComplet } from './../../server/app/motComplet';


export class RequisPourMotsComplets {
        public listeMotComplet: MotComplet[] = new Array();
        public guidPartie: string;

        constructor (guidpartie: string) {
            this.guidPartie = guidpartie;
        }

        public static rehydrater(source: any): RequisPourMotsComplets {
            let sourceRequisPourMotsComplets = source as RequisPourMotsComplets;
            let vraiRequisPourMotsComplets = new RequisPourMotsComplets(sourceRequisPourMotsComplets.guidPartie);

            Object.assign(vraiRequisPourMotsComplets, sourceRequisPourMotsComplets);

            return vraiRequisPourMotsComplets;
        }   


        public remplirListeMotComplets(liste: MotComplet[]) {
            this.listeMotComplet = liste;
        }
}
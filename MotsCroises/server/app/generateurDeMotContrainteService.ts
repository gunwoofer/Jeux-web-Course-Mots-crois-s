import { MotComplet } from './motComplet';
import { Indice } from './indice';
import { MotDataMuse } from './motDataMuse';

const datamuse = require('datamuse');

export const aucunMotObtenuDeDataMuse = 'Aucun mot n\'a été reccueilli de l\'API datamuse.';

export class GenerateurDeMotContrainteService {

    public demanderMotsADatamuse(contrainte: string): Promise<MotComplet> {
        return new Promise((resolve: any, reject: any) => {
            datamuse.request('words?sp=' + contrainte + '&md=df').then((motsDataMuse: MotDataMuse[]) => {
                const motComplet: MotComplet = new MotComplet(contrainte, new Indice(motsDataMuse[0].defs));

                if (motComplet !== undefined) {
                    resolve(motComplet);
                }
                reject(aucunMotObtenuDeDataMuse);

            }).catch((erreur: any) => {
                reject(erreur);
            });
        });
    }
}

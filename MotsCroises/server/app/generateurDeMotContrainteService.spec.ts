import { assert } from 'chai';
import { GenerateurDeMotContrainteService } from './generateurDeMotContrainteService';
import { Niveau } from '../../commun/niveau';

export const maxDelaiRetourRequeteMS = 10000;

describe('GenerateurDeMotContrainteService', () => {

    it('Il est possible d\'obtenir un mot et ses definitions', (done) => {
        const mot = 'buy';
        const monGenerateurDeMot = new GenerateurDeMotContrainteService();

        monGenerateurDeMot.demanderMotsADatamuse(mot).then((motAPI) => {
            assert(motAPI.indice.obtenirDefinition(Niveau.facile) !== '');
            done();
        })
        .catch((erreur) => {
            assert(false);
            done();
        });

    }).timeout(maxDelaiRetourRequeteMS);
});

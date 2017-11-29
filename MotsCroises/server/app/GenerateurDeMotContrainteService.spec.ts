import { assert } from 'chai';
import { GenerateurDeMotContrainteService, aucunMotObtenuDeDataMuse } from './GenerateurDeMotContrainteService';
import { Niveau } from '../../commun/Niveau';

export const maxDelaiRetourRequeteMS = 10000;

describe('GenerateurDeMotContrainteService', () => {

    it('Il est possible d obtenir un mot et ses definitions', (done) => {
        const mot = 'buy';
        const monGenerateurDeMot = new GenerateurDeMotContrainteService();

        monGenerateurDeMot.demanderMotsADatamuse(mot).then((motAPI) => {
            assert(motAPI.obtenirIndice().obtenirDefinition(Niveau.facile) !== '');
            done();
        })
        .catch((erreur) => {
            assert(false);
            done();
        });

    }).timeout(maxDelaiRetourRequeteMS);
});

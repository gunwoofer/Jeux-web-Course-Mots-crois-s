import { assert } from 'chai';
import * as configuration from './configuration';

describe('Configuration', () => {
    it('La connexion de mongodb se fait à l\'aide du serveur distant.', () => {
        assert(configuration.baseDeDonneesUrl === <string>configuration.baseDeDonneesUrlExterne);
    });
});

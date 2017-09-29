import { assert } from 'chai';
import { Joueur } from './Joueur';
import { TypePartie, Partie } from './Partie';
import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Niveau } from './Grille';

export const maxDelaiRetourRequeteMS = 10000;

describe('GestionnaireDePartieService', () => {

    it('Il est possible de créer une partie classique pour un joueur.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.classique;
        const generateurDeGrilleService: GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService(generateurDeGrilleService);
        let guidPartie = '';

        try {
            guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, Niveau.facile);

            assert(gestionniareDePartieService.obtenirPartieEnCours(guidPartie) !== undefined);
            done();

        } catch(e) {
            console.log(e);
            assert(false);
            done();
        }

    }).timeout(maxDelaiRetourRequeteMS);

        it('Il est possible de créer une partie dynamique pour un joueur.', (done) => {
            const joueur: Joueur = new Joueur();
            const typePartie: TypePartie = TypePartie.dynamique;
            const generateurDeGrilleService: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService(generateurDeGrilleService);
            let guidPartie = '';

            try {
                guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, Niveau.facile);

                assert(gestionniareDePartieService.obtenirPartieEnCours(guidPartie) !== undefined);
                done();

            } catch(e) {
                console.log(e);
                assert(false);
                done();
            }

        }).timeout(maxDelaiRetourRequeteMS);
});

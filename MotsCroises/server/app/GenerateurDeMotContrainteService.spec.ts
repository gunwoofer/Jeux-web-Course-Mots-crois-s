import { assert } from 'chai';
import { GenerateurDeMotContrainteService, aucunMotObtenuDeDataMuse } from './GenerateurDeMotContrainteService';
import { Niveau } from '../../commun/Niveau';
import { Rarete } from './MotComplet';
import { Contrainte } from './Contrainte';

export const maxDelaiRetourRequeteMS = 10000;

describe('GenerateurDeMotContrainteService', () => {

    it('Un mot peut etre genere aleatoirement selon certaines contraintes d\'emplacements de lettres', (done) => {

        const contrainte1 = new Contrainte('h', 0);
        const contrainte2 = new Contrainte('e', 1);
        const nombreLettre = 5;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre, [contrainte1, contrainte2]);
        monGenerateurDeMot.genererMotAleatoire(Niveau.facile).then((donnees: any) => {
            const lettresObtenu: string = donnees.lettres;
            const premiereLettre: string = lettresObtenu.charAt(0);
            const deuxiemeLettre: string = lettresObtenu.charAt(1);
            assert(premiereLettre === 'H');
            assert(deuxiemeLettre === 'E');
            done();
        }).catch((erreur) => {
            assert(false);
            done();
        });

    }).timeout(maxDelaiRetourRequeteMS);

    it('Un mot peut être généré aléatoirement selon une taille', (done) => {
        const nombreLettre = 6;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
        monGenerateurDeMot.genererMotAleatoire(Niveau.facile).then((mot) => {
            assert(mot.obtenirLettres().length === nombreLettre);
            done();
        })
        .catch((erreur => {
            assert(false);
            done();
        }));
    }).timeout(maxDelaiRetourRequeteMS);

    it('Si aucun mot ne respecte les contraintes alors cela donne une erreur.', (done) => {
        // Un mot commencant par 'lnnn' n'existe pas... !
        const contrainte1 = new Contrainte('l', 0);
        const contrainte2 = new Contrainte('n', 3);
        const contrainte3 = new Contrainte('n', 4);
        const contrainte4 = new Contrainte('n', 5);
        const nombreLettre = 8;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre, [contrainte1, contrainte2, contrainte3, contrainte4]);
        monGenerateurDeMot.genererMotAleatoire(Niveau.facile).then((mot) => {
            assert(false);
            done();
        })
        .catch((erreur) => {
            if (erreur === aucunMotObtenuDeDataMuse) {
                assert(true);
                done();
            }
        });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible d obtenir un mot commun et ses definitions', (done) => {
        const nombreLettre = 5;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
        monGenerateurDeMot.genererMotAleatoire(Niveau.facile).then((mot) => {
            assert(mot.obtenirIndice().obtenirDefinition(Niveau.facile) !== '');
            assert(mot.obtenirRarete() === Rarete.commun);
            done();
        })
        .catch((erreur) => {
            assert(false);
            done();
            console.log(erreur);
        });

    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible d obtenir un mot non commum et ses definitions', (done) => {
        const nombreLettre = 5;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
        monGenerateurDeMot.genererMotAleatoire(Niveau.difficile).then((mot) => {
            assert(mot.obtenirIndice().obtenirDefinition(Niveau.facile) !== '');
            assert(mot.obtenirRarete() === Rarete.nonCommun);
            done();
        })
        .catch((erreur) => {
            assert(false);
            done();
            console.log(erreur);
        });

    }).timeout(maxDelaiRetourRequeteMS);
});

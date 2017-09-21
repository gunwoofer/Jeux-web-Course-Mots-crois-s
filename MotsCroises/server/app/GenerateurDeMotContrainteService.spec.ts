import { assert } from 'chai';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { GenerateurDeMotContrainteService } from './GenerateurDeMotContrainteService';
import { Grille, Niveau } from './Grille';
import { Case, EtatCase } from './Case';
import { Rarete } from './Mot';
import { Indice, DifficulteDefinition } from './Indice';
import { EmplacementMot } from './EmplacementMot';
import { Contrainte } from './Contrainte';
import { Mot } from './Mot';

export const maxDelaiRetourRequeteMS = 10000;

describe('GenerateurDeMotContrainteService', () => {
    it('Un mot peut etre genere aleatoirement selon certaines contraintes d emplacements de lettres', (done) => {

        let contrainte1 = new Contrainte('h', 0);
        let contrainte2 = new Contrainte('e', 1);
        let nombreLettre: number = 5;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre, [contrainte1, contrainte2]);
        monGenerateurDeMot.genererMot(Niveau.facile).then((donnees: any) => {
            const lettresObtenu: string = donnees.lettres;
            const premiereLettre: string = lettresObtenu.charAt(0);
            const deuxiemeLettre: string = lettresObtenu.charAt(1);
            assert(premiereLettre === 'H');
            assert(deuxiemeLettre === 'E');
            done();
        }).catch((Error) => {
            assert(false);
            done(Error);
        });

    }).timeout(maxDelaiRetourRequeteMS);
/*
    it('Un mot peut etre genere aleatoirement selon une taille', (done) => {
        let nombreLettre: number = 6;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
        monGenerateurDeMot.genererMot(Niveau.facile).then((mot) => {
            assert(mot.obtenirLettres().length === nombreLettre);
            done();
        });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Si aucun mot ne respecte les contraintes donnees le generateur renvoi un mot vide', (done) => {
        //Un mot commencant par 'lnnn'
        let contrainte1 = new Contrainte('l', 0);
        let contrainte2 = new Contrainte('n', 3);
        let contrainte3 = new Contrainte('n', 4);
        let contrainte4 = new Contrainte('n', 5);
        let nombreLettre: number = 8;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre, [contrainte1, contrainte2, contrainte3, contrainte4]);
        monGenerateurDeMot.genererMot(Niveau.facile).then((mot) => {
            assert(mot.obtenirLettres() === '');
            done();
        });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible d obtenir des mots communs ou non communs', (done) => {

        let nombreLettre = 5;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
        let compteur = 2;
        monGenerateurDeMot.genererMot(Niveau.facile).then((mot) => {
            assert(mot.obtenirRarete() === Rarete.commun);
            compteur--;
            if (compteur === 0) {
                done();
            }
        });
        monGenerateurDeMot.genererMot(Niveau.difficile).then((mot) => {
            assert(mot.obtenirRarete() === Rarete.nonCommun);
            compteur--;
            if (compteur === 0) {
                done();
            }
        });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible d obtenir un mot et ses definitions', (done) => {

        let nombreLettre: number = 5;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
        monGenerateurDeMot.genererMot(Niveau.facile).then((mot) => {
            assert(mot.obtenirIndice().obtenirDefinition(DifficulteDefinition.PremiereDefinition) !== "");
            done();
        });

    }).timeout(maxDelaiRetourRequeteMS);
    */
});





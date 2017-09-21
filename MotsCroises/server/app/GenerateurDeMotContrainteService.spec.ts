import { assert } from 'chai';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { GenerateurDeMotContrainteService } from './GenerateurDeMotContrainteService';
import { Grille, Niveau } from './Grille';
import { Case, EtatCase } from './Case';
import { Rarete } from './Mot';
import { Indice, DifficulteDefinition } from './Indice';
import { EmplacementMot } from './EmplacementMot';
import { Contrainte } from './Contrainte';

describe('GenerateurDeMotContrainteService', () => {
    it('Un mot peut etre genere aleatoirement selon certaines contraintes d emplacements de lettres', () => {
        let contrainte1 = new Contrainte('l', 0);
        let contrainte2 = new Contrainte('n', 2);
        let nombreLettre : number = 5;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre, [contrainte1, contrainte2]);
        monGenerateurDeMot.genererMot(Niveau.facile).then((mot) => {
            assert(mot.obtenirLettres()[0] === 'l' && mot.obtenirLettres()[2] === 'n');
        });
    });

    it('Un mot peut etre genere aleatoirement selon une taille', () => {
        let nombreLettre : number = 6;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
        monGenerateurDeMot.genererMot(Niveau.facile).then((mot) => {
            assert(mot.obtenirLettres().length === nombreLettre);
        });
    });

    it('Si aucun mot ne respecte les contraintes donnees le generateur renvoi un mot vide', () => {
        //Un mot commencant par 'lnnn'
        let contrainte1 = new Contrainte('l', 0);
        let contrainte2 = new Contrainte('n', 3);
        let contrainte3 = new Contrainte('n', 4);
        let contrainte4 = new Contrainte('n', 5);   
        let nombreLettre : number = 8;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre, [contrainte1, contrainte2, contrainte3, contrainte4]);
        monGenerateurDeMot.genererMot(Niveau.facile).then((mot) => {
            assert(mot.obtenirLettres() === "");
        });
    });

    it('Il est possible d obtenir des mots communs ou non communs', () => {
        
        let nombreLettre : number = 5;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
        monGenerateurDeMot.genererMot(Niveau.facile).then((mot) => {
            assert(mot.obtenirRarete() === Rarete.commun);
        });
        monGenerateurDeMot.genererMot(Niveau.difficile).then((mot) => {
            assert(mot.obtenirRarete() === Rarete.nonCommun);
        });
    });

    it('Il est possible d obtenir un mot et ses definitions', () => {
        
        let nombreLettre : number = 5;

        const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
        monGenerateurDeMot.genererMot(Niveau.facile).then((mot) => {
            assert(mot.obtenirIndice().obtenirDefinition(DifficulteDefinition.PremiereDefinition) !== "");
        });
        
    });
});





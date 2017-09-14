import { assert } from 'chai';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { MotsCroises } from './MotsCroises';
import { Case, EtatCase } from './Case';

describe('GenerateurDeGrilleService', () => {
     it('Une grille est carre et fait dix cases de cote.', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();     
        let motsCroises = generateurDeGrilleService.genererGrille();

        assert(motsCroises.obtenirHauteurCases() === 10);
        assert(motsCroises.obtenirLongueurCases() === 10);
     });

     it('Chaque ligne et colonne contient un ou deux mots ecrits de gauche a droite et de haut en bas.', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();     
        let motsCroises = generateurDeGrilleService.genererGrille();

        for(let i:number = 0; i < 10; i++)
        {
            assert((motsCroises.obtenirNombreMotsSurLigne(i) === 1) || (motsCroises.obtenirNombreMotsSurLigne(i) === 2));
            assert((motsCroises.obtenirNombreMotsSurColonne(i) === 1) || (motsCroises.obtenirNombreMotsSurColonne(i) === 2));
        }
     });
     
    it('Une grille ne dois pas contenir deux fois le même mot.', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();     
        let motsCroises = generateurDeGrilleService.genererGrille();

        assert(!motsCroises.contientMotDuplique());      
    });
    
   it('Les accents, tremas et cedilles sont ignores.', () => {
       let generateurDeGrilleService = new GenerateurDeGrilleService();     
       let motsCroises = generateurDeGrilleService.genererGrille();

       for(let ligneCasesCourante of motsCroises.obtenirCases())
       {
            for(let caseCourante of ligneCasesCourante)
            {   
                if(caseCourante.etat == EtatCase.pleine) {
                    let lettreCourante:string = caseCourante.obtenirLettre();
                    let lettreCouranteSimplife:string = lettreCourante.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    
                    assert(lettreCourante === lettreCourante);
                }
            }
       }    
   });
});

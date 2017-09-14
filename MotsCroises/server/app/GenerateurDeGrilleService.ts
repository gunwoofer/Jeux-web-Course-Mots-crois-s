
import { MotsCroises } from './MotsCroises';
import { Case, EtatCase } from './Case';


export class GenerateurDeGrilleService {

    private motCroiseGenere : MotsCroises = new MotsCroises();


    public constructor(){

    }

    public genererGrille(): MotsCroises{
        //Algorithme de generation
        this.motCroiseGenere = this.genereGrilleVide();
        this.motCroiseGenere = this.remplirGrille();
        return this.motCroiseGenere;
    }

    private genereGrilleVide(): MotsCroises{

        let motCroiseVide = new MotsCroises;

        let tableauNoir = new Array();
        
        // Cases noirs
        tableauNoir.push([0,0]);
        tableauNoir.push([2,0]);
        tableauNoir.push([4,0]);
        tableauNoir.push([9,0]);

        tableauNoir.push([6,1]);
        tableauNoir.push([8,1]);

        tableauNoir.push([0,2]);
        tableauNoir.push([2,2]);
        tableauNoir.push([4,2]);

        tableauNoir.push([6,3]);
        tableauNoir.push([8,3]);

        tableauNoir.push([0,4]);
        tableauNoir.push([2,4]);

        tableauNoir.push([7,5]);
        tableauNoir.push([9,5]);

        tableauNoir.push([1,6]);
        tableauNoir.push([3,6]);

        tableauNoir.push([5,7]);
        tableauNoir.push([7,7]);
        tableauNoir.push([9,7]);

        tableauNoir.push([1,8]);
        tableauNoir.push([3,8]);

        tableauNoir.push([0,9]);
        tableauNoir.push([5,9]);
        tableauNoir.push([7,9]);
        tableauNoir.push([9,9]);

        
        for(let duo of tableauNoir) {
            motCroiseVide.changerEtatCase(EtatCase.noir, duo[0], duo[1]);
        }

        

        return motCroiseVide;
            
        

    }

    private remplirGrille(): MotsCroises {
        let motsCroisesPlein = this.motCroiseGenere;





        // Vérifier si l'on peut insérer un mot sans contrainte de positionnement.
            // Si l'on peut, insérer le mot.
            // Sinon, vérifier les mots disponibles sans contrainte.


        return motsCroisesPlein;
    }

}
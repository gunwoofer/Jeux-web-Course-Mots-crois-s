
import { MotsCroises } from './MotsCroises';
import { Case, EtatCase } from './Case';


export class GenerateurDeGrilleService {
    private motCroiseGenere : MotsCroises;


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

        for(var i = 0; i < 10; i++) {
            for(var j = 0; j < 10; j++) {

                for(let duo of tableauNoir) {
                    if(i == duo[0] && j == duo[1]){
                        let caseNoir = new Case(i,j, EtatCase.noir);
                        motCroiseVide.ajouterCase(caseNoir);
                    }
                    else{
                        let caseBlanche = new Case(i,j, EtatCase.vide);
                        motCroiseVide.ajouterCase(caseBlanche);
                    }
                }
            }
        }

        return motCroiseVide;
            
        

    }

    private remplirGrille(): MotsCroises {
        let motsCroisesPlein = new MotsCroises;
        return motsCroisesPlein;
    }

}
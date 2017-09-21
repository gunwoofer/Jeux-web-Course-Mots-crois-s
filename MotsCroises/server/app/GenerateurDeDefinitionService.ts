import { Indice, DifficulteDefinition } from './Indice';
import { Mot, Rarete } from './Mot';
import { Grille, Niveau } from './Grille';

const Dictionary = require("oxford-dictionary-api");
let app_id = "02718b65"; 
let app_key = "aadf02c5aa99243b807d1e0775f5efcb";
let dict = new Dictionary(app_id,app_key);

export class GenerateurDeDefinitionService {


    constructor () {
    }


    public genererDefinitions(mot: string, niveau: Niveau): Mot {

        let self: GenerateurDeDefinitionService = this;
        let tableauIndices : string[] = new Array();
        let registre : string;
        let monMot: Mot;
        let monIndice: Indice;

        dict.find(mot, function(error: any,data: any) { 
            if(error){
                return console.log(error);
            } else {
                for (let i = 0; i < data.results.lexicalEntries.length; i++){
                    for(let j = 0; j < data.results.lexicalEntries.entries[i].senses.length; j++) {
                        tableauIndices.push(data.results.lexicalEntries.entries[i].senses[j].definitions);
                        registre = data.results.lexicalEntries.entries[i].senses[j].registers;
                    }
                }

                monIndice = new Indice(tableauIndices);
                monMot = new Mot (mot, monIndice);
                //Le registre est le critere le plus pertinent fourni par l api pour decider de la rareté du mot
                if (registre == "informal") {
                    monMot.setRarete(Rarete.commun);
                }else {
                    monMot.setRarete(Rarete.nonCommun);
                }
            } 
        });

        return monMot;
    }

   

    
}
import { Mot, Rarete } from './Mot';
import { Contrainte } from './Contrainte';
import { Indice, DifficulteDefinition } from './Indice';
import { Grille, Niveau } from './Grille';

const datamuse = require('datamuse');

export class GenerateurDeMotContrainteService {

    private contrainte: Contrainte[];
    private tailleEmplacement: number;

    public constructor(nbreLettres: number, contrainte?: Contrainte[]) {
        this.contrainte = contrainte;
        this.tailleEmplacement = nbreLettres;
    }


    public genererMot(niveau: Niveau): Promise<Mot> {
        return new Promise((resolve: any, reject: any) => {
            let tableauIndice: string[];
            let chaineContrainte = '';
            let monIndice: Indice;
            let monMot: Mot;

            // Un score au dessus de 1000 indique un mot commun et inferieure a 1000 non commun
            const tableauCommun = new Array<any>();   // À défénir
            const tableauNonCommun = new Array<any>();

            for (let i = 0; i < this.tailleEmplacement; i++) {
                chaineContrainte += '?';
            }
            if (this.contrainte !== undefined) {
                for (let i = 0; i < this.contrainte.length - 1; i++) {
                    chaineContrainte = this.replaceCharAt(chaineContrainte, this.contrainte[i].obtenirPositionContrainte(),
                        this.contrainte[i].obtenirLettre());
                }
            }

            let mot: string;
            datamuse.request('words?sp=' + chaineContrainte + '&md=d').then((json: any) => {


                const nombreMotPossible = json.length;
                if (nombreMotPossible === 0) {
                    mot = '';
                    monIndice = new Indice(['']);
                    const pasDeMot = new Mot(mot, monIndice);
                    return pasDeMot;
                } else {
                    for (let i = 0; i < nombreMotPossible; i++) {
                        if (json[i].score > 1000) {
                            tableauCommun.push(json[i]);
                        } else if (json[i].score < 1000) {
                            tableauNonCommun.push(json[i]);
                        }
                    }

                    if (niveau === Niveau.facile) {

                        if (tableauCommun.length === 0) {
                            mot = '';
                            monIndice = new Indice(['']);
                            let pasDeMot = new Mot(mot, monIndice);
                            return pasDeMot;
                        }
                        const nombrealeat = this.nombreAleatoireEntreXEtY(0, tableauCommun.length - 1);

                        mot = tableauCommun[nombrealeat].word;
                        tableauIndice = tableauCommun[nombrealeat].defs;
                        monIndice = new Indice(tableauIndice);
                        monIndice.setDifficulteDefinition(DifficulteDefinition.PremiereDefinition);
                        monMot = new Mot(mot, monIndice);
                        monMot.setRarete(Rarete.commun);
                    }
                    if (niveau === Niveau.moyen) {
                        if (tableauCommun.length === 0) {
                            mot = '';
                            monIndice = new Indice(['']);
                            const pasDeMot = new Mot(mot, monIndice);
                            return pasDeMot;
                        }
                        const nombrealeat = this.nombreAleatoireEntreXEtY(0, tableauCommun.length);

                        mot = tableauCommun[nombrealeat].word;
                        tableauIndice = tableauCommun[nombrealeat].defs;
                        monIndice = new Indice(tableauIndice);
                        monIndice.setDifficulteDefinition(DifficulteDefinition.DefinitionAlternative);
                        monMot = new Mot(mot, monIndice);
                        monMot.setRarete(Rarete.commun);

                    }
                    if (niveau === Niveau.difficile) {
                        if (tableauNonCommun.length === 0) {
                            mot = '';
                            monIndice = new Indice(['']);
                            const pasDeMot = new Mot(mot, monIndice);
                            return pasDeMot;
                        }
                        const nombrealeat = this.nombreAleatoireEntreXEtY(0, tableauNonCommun.length);

                        mot = tableauNonCommun[nombrealeat].word;
                        tableauIndice = tableauNonCommun[nombrealeat].defs;
                        monIndice = new Indice(tableauIndice);
                        monIndice.setDifficulteDefinition(DifficulteDefinition.DefinitionAlternative);
                        monMot = new Mot(mot, monIndice);
                        monMot.setRarete(Rarete.nonCommun);
                    }
                }

                resolve(monMot);
            }).catch((erreur: any) => {
                reject(erreur);
            });

        });
    }

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public replaceCharAt(s: string, pos: number, c: string): string {
        return s.substring(0, pos) + c + s.substring(pos + 1);
    }
}

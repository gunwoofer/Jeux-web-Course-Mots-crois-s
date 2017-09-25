import { Mot, Rarete } from './Mot';
import { Contrainte } from './Contrainte';
import { Indice, DifficulteDefinition } from './Indice';
import { Niveau } from './Grille';
import { MotDataMuse } from './MotDataMuse';

const datamuse = require('datamuse');

const aucunMotObtenuDeDataMuse = 'Aucune mot n\'a été reccueilli de l\'API datamuse.';
const aucunMotDansTableauCommun = 'Aucune mot se trouve dans le tableau commun des mots reccueillis.';
const aucunMotDansTableauNonCommun = 'Aucune mot se trouve dans le tableau non commun des mots reccueillis.';

export class GenerateurDeMotContrainteService {

    private contrainte: Contrainte[];
    private tailleEmplacement: number;

    public constructor(nbreLettres: number, contrainte?: Contrainte[]) {
        this.contrainte = contrainte;
        this.tailleEmplacement = nbreLettres;
    }

    public genererMotAleatoire(niveau: Niveau): Promise<Mot> {
        return new Promise((resolve: any, reject: any) => {
            const contrainte = this.preparerContrainte();

            this.obtenirMotAleatoireDeDataMuse(contrainte, niveau)
                .then((resultat: Mot) => { resolve(resultat); })
                .catch((erreur: string) => { reject(erreur); });
        });
    }

    public preparerContrainte(): string {
        let contrainte = '';

        for (let i = 0; i < this.tailleEmplacement; i++) {
            contrainte += '?';
        }

        if (this.contrainte !== undefined) {
            for (let i = 0; i < this.contrainte.length - 1; i++) {
                contrainte = this.replaceCharAt(contrainte, this.contrainte[i].obtenirPositionContrainte(),
                    this.contrainte[i].obtenirLettre());
            }
        }

        return contrainte;
    }

    private creerMotAleatoireAPartirDe(motsDataMuse: MotDataMuse[], difficulteDefinition: DifficulteDefinition, rarete: Rarete): Mot {
        let mot: Mot;
        const nombrealeat = this.nombreAleatoireEntreXEtY(0, motsDataMuse.length - 1);
        const monIndice: Indice = new Indice(motsDataMuse[nombrealeat].defs);

        monIndice.setDifficulteDefinition(difficulteDefinition);
        mot = new Mot(motsDataMuse[nombrealeat].word, monIndice);
        mot.setRarete(rarete);

        return mot;
    }

    private obtenirMotAleatoireDeDataMuse(contrainte: string, niveau: Niveau): Promise<Mot> {

        // Un score au dessus de 1000 indique un mot commun et inferieure a 1000 non commun
        const tableauCommun = new Array<any>();
        const tableauNonCommun = new Array<any>();

        return new Promise((resolve: any, reject: any) => {
            datamuse.request('words?sp=' + contrainte + '&md=df').then((motsDataMuse: MotDataMuse[]) => {
                motsDataMuse = MotDataMuse.convertirJsonEnMotsDataMuse(motsDataMuse);

                const nombreMotPossible = motsDataMuse.length;

                if (nombreMotPossible === 0) {
                    reject(aucunMotObtenuDeDataMuse);
                }

                for (const motDataMuseCourant of motsDataMuse) {

                    if (motDataMuseCourant.estUnMotNonCommun()) {
                        tableauCommun.push(motDataMuseCourant);
                    } else {
                        tableauNonCommun.push(motDataMuseCourant);
                    }
                }

                switch (niveau) {
                    case Niveau.facile:
                        if (tableauCommun.length > 0) {
                            resolve(this.creerMotAleatoireAPartirDe(tableauCommun, DifficulteDefinition.PremiereDefinition, Rarete.commun));
                        } else {
                            reject(aucunMotDansTableauCommun);
                        }
                        break;

                    case Niveau.moyen:
                        if (tableauCommun.length > 0) {
                            resolve(this.creerMotAleatoireAPartirDe(tableauCommun,
                                DifficulteDefinition.DefinitionAlternative, Rarete.commun));
                        } else {
                            reject(aucunMotDansTableauCommun);
                        }
                        break;

                    case Niveau.difficile:
                        if (tableauNonCommun.length > 0) {
                            resolve(this.creerMotAleatoireAPartirDe(tableauNonCommun,
                                DifficulteDefinition.DefinitionAlternative, Rarete.nonCommun));
                        } else {
                            reject(aucunMotDansTableauNonCommun);
                        }
                        break;

                    default:
                        reject();
                        break;
                }

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

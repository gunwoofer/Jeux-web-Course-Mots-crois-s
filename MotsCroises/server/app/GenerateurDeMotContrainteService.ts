import { MotComplet, Rarete } from './MotComplet';
import { Contrainte } from './Contrainte';
import { Indice, DifficulteDefinition } from './Indice';
import { Niveau } from '../../commun/Niveau';
import { MotDataMuse } from './MotDataMuse';

const datamuse = require('datamuse');

export const aucunMotObtenuDeDataMuse = 'Aucune mot n\'a été reccueilli de l\'API datamuse.';
export const aucunMotDansTableauCommun = 'Aucune mot se trouve dans le tableau commun des mots reccueillis.';
export const aucunMotDansTableauNonCommun = 'Aucune mot se trouve dans le tableau non commun des mots reccueillis.';

export class GenerateurDeMotContrainteService {

    private contraintes: Contrainte[];
    private tailleEmplacement: number;

    public constructor(nbreLettres?: number, contraintes?: Contrainte[]) {
        this.contraintes = contraintes;
        this.tailleEmplacement = nbreLettres;
    }

    public genererMotAleatoire(niveau: Niveau): Promise<MotComplet> {
        return new Promise((resolve: any, reject: any) => {
            const contrainte = this.preparerContrainte();

            this.demanderMotsADatamuse(contrainte)
                .then((resultat: MotComplet) => { resolve(resultat); })
                .catch((erreur: string) => { reject(erreur); });
        });
    }

    public preparerContrainte(): string {
        let contrainte = '';

        for (let i = 0; i < this.tailleEmplacement; i++) {
            contrainte += '?';
        }

        if (this.contraintes !== undefined) {
            for (let i = 0; i < this.contraintes.length; i++) {
                contrainte = this.replaceCharAt(contrainte, this.contraintes[i].obtenirPositionContrainte(),
                    this.contraintes[i].obtenirLettre());
            }
        }

        return contrainte;
    }

    private creerMotAleatoireAPartirDe(motsDataMuse: MotDataMuse[], difficulteDefinition: DifficulteDefinition,
                                            rarete: Rarete): MotComplet {
        let mot: MotComplet;
        const nombrealeat = this.nombreAleatoireEntreXEtY(0, motsDataMuse.length - 1);
        const monIndice: Indice = new Indice(motsDataMuse[nombrealeat].defs);

        monIndice.setDifficulteDefinition(difficulteDefinition);
        mot = new MotComplet(motsDataMuse[nombrealeat].word, monIndice);
        mot.setRarete(rarete);

        return mot;
    }

    public demanderMotsADatamuse(contrainte: string): Promise<MotComplet> {
        return new Promise((resolve: any, reject: any) => {
            datamuse.request('words?sp=' + contrainte + '&md=df').then((motsDataMuse: MotDataMuse[]) => {
                const motComplet: MotComplet = new MotComplet(contrainte, new Indice(motsDataMuse[0].defs));

                if (motComplet !== undefined) {
                    resolve(motComplet);
                }
                reject(aucunMotObtenuDeDataMuse);

            }).catch((erreur: any) => {
                reject(erreur);
            });
        });
    }

    private traiterMots(motsDataMuse: MotDataMuse[], niveau: Niveau): MotComplet {

        // Un score au dessus de 1000 indique un mot commun et inferieure a 1000 non commun
        const tableauCommun = new Array<any>();
        const tableauNonCommun = new Array<any>();

        motsDataMuse = MotDataMuse.convertirJsonEnMotsDataMuse(motsDataMuse);

        for (const motDataMuseCourant of motsDataMuse) {
            if ((motDataMuseCourant.estUnMotNonCommun()) && (motDataMuseCourant.defs !== undefined)
                && (motDataMuseCourant.defs.length !== 1)) {
                tableauNonCommun.push(motDataMuseCourant);
            } else if ((!motDataMuseCourant.estUnMotNonCommun()) && (motDataMuseCourant.defs !== undefined)
                && (motDataMuseCourant.defs.length !== 1)) {
                tableauCommun.push(motDataMuseCourant);
            }
        }

        if ((tableauNonCommun.length > 0 && niveau === Niveau.difficile) || tableauCommun.length > 0 && niveau !== Niveau.difficile) {
            return this.creerMotAleatoireAPartirDe((niveau !== Niveau.difficile) ? tableauCommun : tableauNonCommun,
                                                (niveau !== Niveau.facile) ? DifficulteDefinition.DefinitionAlternative :
                                                DifficulteDefinition.PremiereDefinition, (niveau !== Niveau.difficile) ?
                                                Rarete.commun : Rarete.nonCommun);
        }

        return undefined;
    }

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public replaceCharAt(s: string, pos: number, c: string): string {
        return s.substring(0, pos) + c + s.substring(pos + 1);
    }
}

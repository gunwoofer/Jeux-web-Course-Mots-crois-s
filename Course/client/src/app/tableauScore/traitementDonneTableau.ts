import { Score } from './score.model';

export class TraitementDonneTableau {

    public echanger(chiffresTab: Score[], score: number, score2: number): void {
        const temp = chiffresTab[score];
        chiffresTab[score] = chiffresTab[score2];
        chiffresTab[score2] = temp;
    }

    public partition(chiffresTab: Score[], debut: number, fin: number): number {
        const pivot = chiffresTab[fin].valeur;
        let indexPartition = debut;
        for (let i = debut; i < fin; i++) {
            if (chiffresTab[i].valeur <= pivot) {
                this.echanger(chiffresTab, i, indexPartition);
                indexPartition++;
            }
        }
        this.echanger(chiffresTab, indexPartition, fin);
        return indexPartition;
    }

    public quickSort(chiffresTab: Score[], debut: number, fin: number): void {
        if (debut < fin) {
            const indexPartition = this.partition(chiffresTab, debut, fin);
            this.quickSort(chiffresTab, debut, indexPartition - 1);
            this.quickSort(chiffresTab, indexPartition + 1, fin);
        }
    }

    public cinqMeilleurTemps(temps: Score[]): Score[] {
        temps = temps.slice(0, 5);
        this.donnerUnRang(temps);
        return temps;
    }

    public donnerUnRang(temps: Score[]): void {
        for (let i = 0; i < temps.length; i++) {
            temps[i].position = i + 1;
        }
    }
}
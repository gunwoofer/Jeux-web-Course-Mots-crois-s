import { Injectable } from '@angular/core';

@Injectable()

export class TableauScoreService {

    public echanger(chiffre: number, chiffre2: number): void {
        const temp = chiffre;
        chiffre = chiffre2;
        chiffre2 = temp;
    }

    public partition(chiffresTab: number[], debut: number, fin: number): number {
        const pivot = chiffresTab[fin];
        let indexPartition = debut;
        for (let i = debut; i < fin; i++) {
            if (chiffresTab[i] <= pivot) {
                this.echanger(chiffresTab[i], chiffresTab[indexPartition]);
                indexPartition++;
            }
        }
        this.echanger(chiffresTab[indexPartition], chiffresTab[fin]);
        return indexPartition;
    }

    public quickSort(chiffresTab: number[], debut: number, fin: number): void {
        if (debut < fin) {
            const indexPartition = this.partition(chiffresTab, debut, fin);
            this.quickSort(chiffresTab, debut, indexPartition - 1);
            this.quickSort(chiffresTab, indexPartition + 1, fin);
        }
    }
}

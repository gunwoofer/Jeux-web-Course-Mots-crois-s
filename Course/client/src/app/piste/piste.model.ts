import { NgForm } from '@angular/forms';

export class Piste {

    public nombreFoisJouee: number;
    public coteAppreciation: number;
    public meilleursTemps: number[] = [];
    public vignette: string;
    constructor(public nom: string,
        public typeCourse: string,
        public description: string,
        public listepositions?: any[],
        public id?: number) {
        this.nombreFoisJouee = 0;
        this.coteAppreciation = 0;
        for (let i = 0; i < 5; i++) {
            this.meilleursTemps[i] = i * 2 + 4;
        }
        this.vignette = 'http://royale.zerezo.com/zerace/tracks/formula.png';
    }

    public modifierAttribut(form: NgForm, listePosition: any[]): void {
        this.typeCourse = form.value.typeCourse;
        this.description = form.value.description;
        this.listepositions = listePosition;
    }

    public modifieAttribut(coteAppreciation: number, nombreFoisJouee: number, meilleursTemps: number[]): void {
        this.coteAppreciation = coteAppreciation;
        this.nombreFoisJouee = nombreFoisJouee;
        this.meilleursTemps = meilleursTemps;
    }


}

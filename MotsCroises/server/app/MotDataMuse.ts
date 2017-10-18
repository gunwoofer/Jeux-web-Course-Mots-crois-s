const maximumFrequencePourMotCommun = 50;

export class MotDataMuse {
    public word: string;
    public score: string;
    public defs: string[];
    public tags: string[];

    public static convertirJsonEnMotDataMuse(motDataMuse: MotDataMuse): MotDataMuse {
        return new MotDataMuse(motDataMuse.word, motDataMuse.score, motDataMuse.defs, motDataMuse.tags);
    }

    public static convertirJsonEnMotsDataMuse(motsDataMuse: MotDataMuse[]): MotDataMuse[] {
        const motsDataMuseConvertit: MotDataMuse[] = new Array();

        for (const motDataMuseCourant of motsDataMuse) {
            motsDataMuseConvertit.push(MotDataMuse.convertirJsonEnMotDataMuse(motDataMuseCourant));
        }

        return motsDataMuseConvertit;
    }

    public constructor(word: string, score: string, defs: string[], tags: string[]) {
        this.word = word;
        this.score = score;
        this.defs = defs;
        this.tags = tags;
    }

    public estUnMotNonCommun(): boolean {
        const frequenceDuMot: number = Number(this.tags[0].split(':')[1]);

        if (frequenceDuMot <= maximumFrequencePourMotCommun) {
            return true;
        }

        return false;
    }
}

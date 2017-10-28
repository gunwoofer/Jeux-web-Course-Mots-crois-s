const EMPLACEMENT_MUSIQUE = '../../assets/musiques/';
const FORMAT_MP3 = '.mp3';
const NOM_THEMATIQUE = 'Get The New World';
const NOM_EDITEUR = 'Sims - Building Mode 3';
const NOM_COURSE = 'The Legend of Zelda Ocarina of Time - Gerudo Valley';
const NOM_STINGER = 'Zelda - Ocarina of Time - Treasure Chest 1';
const DEBUT_STINGER = 8;
const DUREE_STINGER = 12;

export class Musique {
    private musique: HTMLAudioElement;
    private duree: number;
    private enEcoute: boolean;

    constructor() {
        this.enEcoute = false;
    }

    private chargerMusique(nom: string): HTMLAudioElement {
        const musique = new Audio(EMPLACEMENT_MUSIQUE + nom + FORMAT_MP3);
        musique.loop = true;
        return musique;
    }

    private lancerMusique(): void {
        if (!this.enEcoute) {
            this.musique.play();
            this.enEcoute = true;
        }
    }

    public arreterMusique(): void {
        if (this.enEcoute) {
            this.musique.pause();
            this.enEcoute = false;
        }
    }

    public lancerMusiqueThematique(): void {
        this.musique = this.chargerMusique(NOM_THEMATIQUE);
        this.lancerMusique();
    }

    public lancerMusiqueEditeur(): void {
        this.musique = this.chargerMusique(NOM_EDITEUR);
        this.lancerMusique();
    }

    public lancerMusiqueCourse(): void {
        this.musique = this.chargerMusique(NOM_COURSE);
        this.lancerMusique();
    }

    public lancerStinger(): void {
        this.musique = this.chargerMusique(NOM_STINGER);
        this.musique.loop = false;
        this.musique.currentTime = DEBUT_STINGER;
        this.lancerMusique();
    }

    public conditionStinger(): void {
        if (this.musique.currentTime > DUREE_STINGER) {
            this.arreterMusique();
            this.lancerMusiqueThematique();
        }
    }
}

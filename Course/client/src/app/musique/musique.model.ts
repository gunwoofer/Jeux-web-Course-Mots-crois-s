import {
    EMPLACEMENT_MUSIQUE, FORMAT_MP3, NOM_THEMATIQUE, NOM_EDITEUR, NOM_COURSE
    , NOM_STINGER, DEBUT_STINGER, DUREE_STINGER
} from './../constant';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { NotificationType } from '../../../../commun/observateur/NotificationType';

export enum EtatMusique {
    enAttente,
    enCoursPartie,
    enCoursArrivee
}

export class Musique implements Observateur {
    private musique: HTMLAudioElement;
    private enEcoute: boolean;
    private etatMusique: EtatMusique = EtatMusique.enAttente;
    public thematique: boolean;

    constructor() {
        this.enEcoute = false;
        this.thematique = false;
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
            this.thematique = false;
        }
    }

    public lancerMusiqueThematique(): void {
        this.musique = this.chargerMusique(NOM_THEMATIQUE);
        this.lancerMusique();
        this.thematique = true;
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

    public notifier(sujet: Sujet, type: NotificationType): void {
        if (type === NotificationType.Non_definie) {
            switch (this.etatMusique) {
                case EtatMusique.enAttente:
                    // Debut
                    this.lancerMusiqueCourse();
                    this.etatMusique = EtatMusique.enCoursPartie;
                    break;

                case EtatMusique.enCoursPartie:
                    // Arrive
                    this.arreterMusique();
                    this.lancerStinger();
                    this.etatMusique = EtatMusique.enCoursArrivee;
                    break;
            }
        }
    }
}

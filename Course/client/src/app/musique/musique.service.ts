import { Musique } from './musique.model';
import { Injectable } from '@angular/core';
@Injectable()
export class MusiqueService {
    public musique: Musique;

    constructor () {
        this.musique = new Musique;
    }

    public arreterMusique() {
        this.musique.arreterMusique();
    }
}

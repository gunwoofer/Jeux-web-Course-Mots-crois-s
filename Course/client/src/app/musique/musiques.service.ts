import { MusiqueThematiqueService } from './musiqueThematique.service';
import { Injectable } from '@angular/core';
@Injectable()
export class MusiquesService {
    constructor (public musiqueThematiqueService: MusiqueThematiqueService) {}

    public arreterMusiques() {
        this.musiqueThematiqueService.arreterMusique();
    }
}

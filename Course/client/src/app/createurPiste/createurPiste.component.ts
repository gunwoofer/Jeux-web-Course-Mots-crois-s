import { CreateurPisteService } from './createurPiste.service';
import { EvenementService } from './../gestionnaireEvenement/gestionnaireEvenement.service';
import { MusiqueService } from './../musique/musique.service';
import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { MoteurEditeurPiste } from '../moteurEditeurPiste/render.service';
import { MessageErreurService } from '../messageErreurs/messageerreur.service';
import { PisteService } from '../piste/piste.service';
import { Piste } from './../piste/piste.model';

@Component({
  moduleId: module.id,
  selector: 'app-createurpiste-component',
  templateUrl: './createurPiste.component.html',
  styleUrls: ['./createurPiste.component.css']
})
export class CreateurPisteComponent implements OnInit {

    // public, car il est utilisé dans le html.
    public pisteAModifier: Piste;
    public message;

    @ViewChild('container')
    private containerRef: ElementRef;

    constructor(private renderService: MoteurEditeurPiste,
                private evenementService: EvenementService,
                private pisteService: PisteService,
                private messageErreurService: MessageErreurService,
                private musiqueService: MusiqueService,
                private createurPisteService: CreateurPisteService
                ) { }

    public get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.renderService.onResize();
    }

    public ngOnInit(): void {
        this.renderService.initialize(this.container);
        this.pisteService.pisteAEditer.subscribe( (piste: Piste) => this.createurPisteService.pisteAmodifie = piste );
        this.musiqueService.musique.arreterMusique();
        this.musiqueService.musique.lancerMusiqueEditeur();
    }

    public sourisDeplacement(event: MouseEvent): void {
        this.evenementService.onMouseMove(event);
    }

    public sourisClique(event: MouseEvent): void {
        this.evenementService.onMouseClick(event);
    }

    public sourisBas(event: MouseEvent): void {
        this.evenementService.onMouseDown(event);
    }

    public sourisRelache(event: MouseEvent): boolean {
        this.evenementService.onMouseUp(event);
        return false;
    }

    public estValide(): boolean {
        this.pisteAModifier = this.createurPisteService.pisteAmodifie;
        return this.renderService.retourneEtatDessin();
    }

    public erreursCircuit(): boolean {
        if (this.messageErreurService.afficherMessageErreurs(this.createurPisteService.nbAnglesPlusPetit45,
            this.createurPisteService.nbSegmentsTropProche,
            this.createurPisteService.nbSegmentsCroises)) {
            this.message = this.messageErreurService.afficherMessageErreurs(this.createurPisteService.nbAnglesPlusPetit45,
                                                                            this.createurPisteService.nbSegmentsTropProche,
                                                                            this.createurPisteService.nbSegmentsCroises);
            return true;
        }

        return false;
    }

    // Nom spécifique à la librairie. Ne pas changer sinon l'événement n'est pas détecté.
    public oncontextmenu(): boolean {
        this.evenementService.rightClick();

        return false;
    }
}



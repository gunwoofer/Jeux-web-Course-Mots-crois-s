import { EvenementService } from './../gestionnaireEvenement/gestionnaireEvenement.service';
import { MusiqueService } from './../musique/musique.service';
import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { RenderService } from '../renderService/render.service';
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

    public pisteAModifier: Piste;
    public message;

    @ViewChild('container')
    private containerRef: ElementRef;
    private affiche: boolean;

    constructor(private renderService: RenderService,
                private evenementService: EvenementService,
                private pisteService: PisteService,
                private messageErreurService: MessageErreurService,
                private musiqueService: MusiqueService
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
        this.pisteService.pisteAEditer.subscribe( (piste: Piste) => this.renderService.pisteAmodifie = piste );
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
        this.pisteAModifier = this.renderService.pisteAmodifie;
        return this.affiche = this.renderService.retourneEtatDessin();
    }

    public erreursCircuit(): boolean {
        if (this.messageErreurService.afficherMessageErreurs(this.renderService.nbAnglesPlusPetit45,
            this.renderService.nbSegmentsTropProche,
            this.renderService.nbSegmentsCroises)) {
            this.message = this.messageErreurService.afficherMessageErreurs(this.renderService.nbAnglesPlusPetit45,
            this.renderService.nbSegmentsTropProche,
            this.renderService.nbSegmentsCroises);

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



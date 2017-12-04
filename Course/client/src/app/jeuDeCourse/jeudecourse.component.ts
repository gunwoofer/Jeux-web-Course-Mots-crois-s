import { GestionnnairePartieService } from './../gestionnairePartie/gestionPartie.service';
import { RESULTAT_PARTIE, MILLE } from '../constant';
import { MusiqueService } from './../musique/musique.service';
import { JeuDeCourseService } from './jeudecourse.service';
import { Component, ViewChild, HostListener, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { PisteService } from '../piste/piste.service';
import { Router } from '@angular/router';
import { EvenementService } from '../gestionnaireEvenement/gestionnaireEvenement.service';
import { TableauScoreService } from '../tableauScore/tableauScoreService.service';
import { Pilote } from '../partie/Pilote';

@Component({
    selector: 'app-jeudecourse-component',
    templateUrl: './jeudecourse.component.html',
    styleUrls: ['./jeudecourse.component.css'],
})

export class JeuDeCourseComponent implements AfterViewInit, OnInit {

    @ViewChild('container')
    private containerRef: ElementRef;

    constructor(private jeuDeCourseService: JeuDeCourseService, private gestionnairePartieService: GestionnnairePartieService,
        private pisteService: PisteService, private evenementService: EvenementService,
        private musiqueService: MusiqueService, private routeur: Router) {

        //jeuDeCourseService.configurerTours(this.pisteService.nombreDeTours);
    }

    public ngOnInit(): void {
        this.musiqueService.musique.arreterMusique();
    }

    public ngAfterViewInit(): void {
        this.jeuDeCourseService.initialisation(this.container);
        this.gestionnairePartieService.emetteurEvenement.subscribe(
            (reponse) => this.routeur.navigateByUrl(RESULTAT_PARTIE));
    }

    public get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    @HostListener('window:resize', ['$event'])
    public onResize(): void {
        this.jeuDeCourseService.onResize();
    }

    @HostListener('document:keypress', ['$event'])
    public touchePressee(event: KeyboardEvent): void {
        this.evenementService.gestionEvenement(event);
    }

    @HostListener('document:keydown', ['$event'])
    public touchePesee(event: KeyboardEvent): void {
        this.evenementService.touchePesee(event);
    }

    @HostListener('document:keyup', ['$event'])
    public toucheLachee(event: KeyboardEvent): void {
        this.evenementService.toucheRelachee(event);
    }
}

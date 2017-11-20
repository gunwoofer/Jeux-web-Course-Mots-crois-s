import { MusiqueService } from './../musique/musique.service';
import { GenerateurPisteService } from './generateurpiste.service';
import { Component, ViewChild, HostListener, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { PisteService } from '../piste/piste.service';
import { Router } from '@angular/router';
import { EvenementService } from '../gestionnaireEvenement/gestionnaireEvenement.service';

@Component({
    selector: 'app-generateurpiste-component',
    templateUrl: './generateurpiste.component.html',
    styleUrls: ['./generateurpiste.component.css']
})

export class GenerateurPisteComponent implements AfterViewInit, OnInit {

    @ViewChild('container')
    private containerRef: ElementRef;

    constructor(private generateurPisteService: GenerateurPisteService,
        pisteService: PisteService, private evenementService: EvenementService,
        private musiqueService: MusiqueService,
        private router: Router
    ) {
        generateurPisteService.ajouterRouter(router);
        generateurPisteService.configurerTours(pisteService.nombreDeTours);
    }

    public ngOnInit(): void {
        this.musiqueService.musique.arreterMusique();
    }

    public ngAfterViewInit(): void {
        this.generateurPisteService.initialisation(this.container);
    }

    public get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    @HostListener('window:resize', ['$event'])
    public onResize(): void {
        this.generateurPisteService.onResize();
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

    public allerTableauDeResultats(): void {
        this.router.navigateByUrl('/resultatPartie');
    }
}

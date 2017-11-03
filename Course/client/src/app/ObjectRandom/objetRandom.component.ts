import { NgForm } from '@angular/forms';
import { ObjetRandomService } from './objetRandom.service';
import { Component, ViewChild, HostListener, ElementRef, AfterViewInit, OnInit } from '@angular/core';

@Component({
    selector: 'app-objetrandom-component',
    templateUrl: './objetRandom.component.html',
    styleUrls: ['./objetRandom.component.css']
})
export class ObjetRandomComponent implements AfterViewInit {

    @ViewChild('container') private containerRef: ElementRef;
    private disableFiltrage = false;

    constructor(private objetRandomService: ObjetRandomService) { }

    public ngAfterViewInit() {
        this.objetRandomService.initialisation(this.container);
    }

    public get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.objetRandomService.onResize();
    }
}

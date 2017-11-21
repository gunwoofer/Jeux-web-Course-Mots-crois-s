import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-affichagetetehaute-component',
    templateUrl: './affichagetetehaute.component.html',
    styleUrls: ['./affichagetetehaute.component.css']
})

export class AffichageTeteHauteComponent implements OnInit, OnDestroy {

    public ngOnInit(): void {
        console.log('affichage tete haute présente.');
    }

    public ngOnDestroy(): void {
    }

}

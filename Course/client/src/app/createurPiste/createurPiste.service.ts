import { PointsFacade } from './../pointsFacade';
import { FacadePointService } from './../facadePoint/facadepoint.service';
import { Injectable } from '@angular/core';
import { Piste } from '../piste/piste.model';
import { FacadeLigneService } from '../facadeLigne/facadeLigne.service';
import { ContraintesCircuit } from '../contraintesCircuit/contraintesCircuit';

@Injectable()
export class CreateurPisteService {

    public pisteAmodifie: Piste;
    public pointsLine;
    public nbSegmentsCroises = 0;
    public nbAnglesPlusPetit45 = 0;
    public nbSegmentsTropProche = 0;
    private contraintesCircuit = new ContraintesCircuit();

    constructor(private facadePointService: FacadePointService) { }

    public initialisationLigne(): void {
        this.pointsLine = FacadeLigneService.creerLignePoints();
    }

    public actualiserContrainte(points: PointsFacade[], dessinTermine: boolean): void {
        this.nbSegmentsCroises = this.contraintesCircuit.nombreLignesCroisees(points, dessinTermine);
        this.nbSegmentsTropProche = this.contraintesCircuit.nombreSegmentsTropCourts(points);
        this.nbAnglesPlusPetit45 = this.contraintesCircuit.nombreAnglesMoins45(points,
                                                                               this.facadePointService.compteur, dessinTermine);
    }

}
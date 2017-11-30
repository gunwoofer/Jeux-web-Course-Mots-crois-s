import { CalculateurNombreLigneCroise } from './calculateurNombreLigneCroise';
import { CalculateurNombreSegmentsCourts } from './calculateurNombreSegmentsCourts';
import { CalculateurNombreOngle } from './calculateurNombreAngle';
import * as THREE from 'three';

export class ContraintesCircuit {

    public calculateurNombreOngle: CalculateurNombreOngle;
    public calculateurNombreSegmentsCourts: CalculateurNombreSegmentsCourts;
    public calculateurNombreLigneCroise: CalculateurNombreLigneCroise;

    constructor() {
        this.calculateurNombreOngle = new CalculateurNombreOngle();
        this.calculateurNombreSegmentsCourts = new CalculateurNombreSegmentsCourts();
        this.calculateurNombreLigneCroise = new CalculateurNombreLigneCroise();
    }

    public nombreAnglesMoins45(points: any[], compteur: number, dessinTermine: boolean): number {
        return this.calculateurNombreOngle.nombreAnglesMoins45(points, compteur, dessinTermine);
    }

    public nombreSegmentsTropCourts(points: any[]): number {
        return this.calculateurNombreSegmentsCourts.nombreSegmentsTropCourts(points);
    }

    public nombreLignesCroisees(points: any[], dessinTermine: boolean): number {
        return this.calculateurNombreLigneCroise.nombreLignesCroisees(points, dessinTermine);
    }
}

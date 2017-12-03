import { PointsFacade } from './../pointsFacade';
import { FacadePointService } from './../facadePoint/facadepoint.service';
import { Injectable } from '@angular/core';
import { Piste } from '../piste/piste.model';
import { FacadeLigneService } from '../facadeLigne/facadeLigne.service';
import { ContraintesCircuit } from '../contraintesCircuit/contraintesCircuit';
import { FacadeCoordonneesService } from '../facadeCoordonnees/facadecoordonnees.service';

@Injectable()
export class CreateurPisteService {

    public pisteAmodifie: Piste;
    public pointsLine;
    public points: PointsFacade[] = new Array();
    public dessinTermine = false;
    public nbSegmentsCroises = 0;
    public nbAnglesPlusPetit45 = 0;
    public nbSegmentsTropProche = 0;
    private contraintesCircuit = new ContraintesCircuit();

    constructor(private facadePointService: FacadePointService,
                private facadeCoordonneesService: FacadeCoordonneesService) { }


    public obtenirPoints(): PointsFacade[] {
        return this.points;
    }

    public obtenirDessinTermine(): boolean {
        return this.dessinTermine;
    }

    public initialisationLigne(): void {
        this.pointsLine = FacadeLigneService.creerLignePoints();
    }

    public actualiserContrainte(points: PointsFacade[], dessinTermine: boolean): void {
        this.nbSegmentsCroises = this.contraintesCircuit.nombreLignesCroisees(points, dessinTermine);
        this.nbSegmentsTropProche = this.contraintesCircuit.nombreSegmentsTropCourts(points);
        this.nbAnglesPlusPetit45 = this.contraintesCircuit.nombreAnglesMoins45(points,
                                                                               this.facadePointService.compteur, dessinTermine);
    }

    public ajouterPoint(point: PointsFacade, scene: THREE.Scene): void {
        if (!this.dessinTermine) {
            scene.add(point);
        }
        FacadeLigneService.ajouterLignePoints(point.position, this.facadePointService.compteur,
                                                this.pointsLine, this.points);
        this.points.push(point);
        this.facadePointService.compteur++;
    }

    public dessinerPoint(event, scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
        let objet, point;

        if (!this.dessinTermine) {
            objet = this.facadeCoordonneesService.obtenirIntersection(event, scene, camera, renderer);
            point = this.facadePointService.creerPoint(objet.point, 'black');
            if (this.points.length === 0) {
                point.material.status = 'premier';
            } else {
                try {
                    this.dessinerDernierPoint(point);
                } catch (e) {
                    alert(e.message);
                        return;
                }
            }
            this.ajouterPoint(point, scene);
        } else {
            return;
        }
    }

    public dessinerDernierPoint(point): void {
        const distance = point.position.distanceTo(this.points[0].position);
        if (distance >= 0 && distance < 3) {
            if (this.points.length > 2) {
                point.position.copy(this.points[0].position);
                this.dessinTermine = true;
            } else {
                throw new Error('une piste a trois points minimum');
            }
        }
    }

    public dessinerPointDejaConnu(position: THREE.Vector3, scene: THREE.Scene): void {
        let point;

        if (!this.dessinTermine) {
            point = this.facadePointService.creerPoint(position, 'black');

            if (this.points.length === 0) {
                point.material.status = 'premier';
            } else {
                try {
                    this.dessinerDernierPoint(point);
                } catch (e) {
                    alert(e.message);
                    return;
                }
            }

            this.ajouterPoint(point, scene);
        } else {
            return;
        }
    }

}
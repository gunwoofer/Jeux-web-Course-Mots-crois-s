import { Injectable } from '@angular/core';
import { Piste } from '../piste/piste.model';
import { SurfaceHorsPiste } from '../surfaceHorsPiste/surfaceHorsPiste.service';
import { Segment } from '../piste/segment.model';
import { FlaqueDEau } from '../elementsPiste/FlaqueDEau';
import { NidDePoule } from '../elementsPiste/NidDePoule';
import { Accelerateur } from '../elementsPiste/Accelerateur';
import { ElementDePiste } from '../elementsPiste/ElementDePiste';
import { ObjetService } from '../objetService/objet.service';
import { PointDeControle } from '../piste/pointDeControle.model';
import { LumiereService } from '../lumiere/lumiere.service';

@Injectable()
export class MondeDuJeuService {
    public piste: Piste;
    public segment: Segment = new Segment();

    public chargerMonde3D(scene: THREE.Scene): void {
        ObjetService.ajouterArbreScene(scene);
        this.segment.ajouterPisteAuPlan(this.piste, scene);
        this.genererTerrain(scene);
        this.ajouterElementDePisteScene(scene);
        PointDeControle.ajouterPointDeControleScene(this.piste, scene);
        LumiereService.ajouterLumierScene(scene);
    }

    public ajouterPiste(piste: Piste): void {
        this.piste = piste;
    }

    public genererTerrain(scene: THREE.Scene ) {
        scene.add(SurfaceHorsPiste.genererTerrain(this.segment.chargerSegmentsDePiste(this.piste)));
    }

    public ajouterElementDePisteScene(scene: THREE.Scene): void {
        for (const element of this.piste.obtenirElementsPiste()) {
            this.preparerEtAjouterElementDePisteAScene(scene, element);
        }
    }

    private preparerEtAjouterElementDePisteAScene(scene: THREE.Scene, element: ElementDePiste): void {
        element.genererMesh();
        element.obtenirMesh().position.set(element.position.x, element.position.y, element.position.z);
        scene.add(element.obtenirMesh());
    }

}

import { Injectable } from '@angular/core';
import { Piste } from '../piste/piste.model';
import { SurfaceHorsPiste } from '../surfaceHorsPiste/surfaceHorsPiste.service';
import { Segment } from '../piste/segment.model';
import { FlaqueDEau } from '../elementsPiste/FlaqueDEau';
import { NidDePoule } from '../elementsPiste/NidDePoule';
import { Accelerateur } from '../elementsPiste/Accelerateur';
import { ElementDePiste } from '../elementsPiste/ElementDePiste';

@Injectable()
export class MondeDuJeuService {
    public piste: Piste;
    public segment: Segment = new Segment();

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

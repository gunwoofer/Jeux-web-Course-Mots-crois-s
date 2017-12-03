import { Injectable } from '@angular/core';
import { Piste } from '../piste/piste.model';
import { SurfaceHorsPiste } from '../surfaceHorsPiste/surfaceHorsPiste.service';
import { Segment } from '../piste/segment.model';

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

}

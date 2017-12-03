import { Injectable } from '@angular/core';
import { Piste } from '../piste/piste.model';
import { SurfaceHorsPiste } from '../surfaceHorsPiste/surfaceHorsPiste.service';
import { Segment } from '../piste/segment.model';

@Injectable()
export class MondeDuJeuService {
    public piste: Piste;

    public ajouterPiste(piste: Piste): void {
        this.piste = piste;
    }

    public genererTerrain(scene: THREE.Scene, segment: Segment, ) {
        scene.add(SurfaceHorsPiste.genererTerrain(segment.chargerSegmentsDePiste(this.piste)));
    }

}

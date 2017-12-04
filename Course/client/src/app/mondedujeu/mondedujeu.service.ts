import { SkyboxService } from './../skybox/skybox.service';
import { Injectable } from '@angular/core';
import { Piste } from '../piste/piste.model';
import { SurfaceHorsPiste } from '../surfaceHorsPiste/surfaceHorsPiste.service';
import { Segment } from '../piste/segment.model';
import { ElementDePiste } from '../elementsPiste/ElementDePiste';
import { ObjetService } from '../objetService/objet.service';
import { PointDeControle } from '../piste/pointDeControle.model';
import { LumiereService } from '../lumiere/lumiere.service';

@Injectable()
export class MondeDuJeuService {
    public piste: Piste;
    public segment: Segment = new Segment();

    constructor(private skyboxService: SkyboxService) { }

    public chargerMonde3D(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
        this.skyboxService.ajouterSkybox(camera);
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

    private genererTerrain(scene: THREE.Scene ) {
        scene.add(SurfaceHorsPiste.genererTerrain(this.segment.chargerSegmentsDePiste(this.piste)));
    }

    private ajouterElementDePisteScene(scene: THREE.Scene): void {
        for (const element of this.piste.obtenirElementsPiste()) {
            this.preparerEtAjouterElementDePisteAScene(scene, element);
        }
    }

    private preparerEtAjouterElementDePisteAScene(scene: THREE.Scene, element: ElementDePiste): void {
        element.genererMesh();
        element.mesh.position.set(element.position.x, element.position.y, element.position.z);
        scene.add(element.mesh);
    }

}

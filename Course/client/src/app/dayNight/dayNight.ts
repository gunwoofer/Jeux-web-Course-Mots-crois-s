import { Injectable } from '@angular/core';
import { HemisphereLight, DirectionalLight, ImageUtils, Scene} from 'three';


@Injectable()
export class GenerateurPisteService {

    private lumiereHemisphere: HemisphereLight;
    private lumiereDirectionnelle: DirectionalLight;

    public lumierHemisphere(): HemisphereLight {

        this.lumiereHemisphere = new HemisphereLight(0xfd720f, 0xffffff, 0.6);
        this.lumiereHemisphere.color.setHSL(0.6, 0.75, 0.5);
        this.lumiereHemisphere.groundColor.setHSL(0.095, 0.5, 0.5);
        this.lumiereHemisphere.position.set(0, 500, 0);
        return this.lumiereHemisphere;
    }
}

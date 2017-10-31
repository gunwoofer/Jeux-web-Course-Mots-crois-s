import { Injectable } from '@angular/core';
import { HemisphereLight, DirectionalLight, ImageUtils, Scene } from 'three';


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

    public lumierDirectionnel(): DirectionalLight {

        this.lumiereDirectionnelle = new DirectionalLight(0xffffff, 1);
        this.lumiereDirectionnelle.color.setHSL(0.1, 1, 0.95);
        this.lumiereDirectionnelle.position.set(-1, 0.75, 1);
        this.lumiereDirectionnelle.position.multiplyScalar(30);
        this.lumiereDirectionnelle.castShadow = true;
        return this.lumiereDirectionnelle;
    }

    public modeJourNuit(event, scene: Scene, lumierDirectionale: DirectionalLight): void {
        if (event.keyCode === 100) {
            // d
            scene.background = ImageUtils.loadTexture('../../assets/textures/téléchargement.jpeg');
            lumierDirectionale.visible = true;
        }

        if (event.keyCode === 97) {
            // a
            scene.background = ImageUtils.loadTexture('../../assets/textures/missions_bg_image.jpg');
            lumierDirectionale.visible = false;
        }
    }
}

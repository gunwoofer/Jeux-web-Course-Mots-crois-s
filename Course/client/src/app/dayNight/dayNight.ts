import { Injectable } from '@angular/core';
import { HemisphereLight, DirectionalLight, ImageUtils, Scene } from 'three';


@Injectable()
export class LumiereService {

    private couleurCiel = 0xfd720f;
    private couleurTerre = 0xffffff;
    private intensité = 0.6;
    private hex = 0xffffff;
    private intensitée = 1;
    private hemiCoulour = { h: 0.6, s: 0.75, l: 0.5 };
    private hemiCoulourTerre = { h: 0.095, s: 0.5, l: 0.5 };
    private directionCoulour = { h: 0.1, s: 1, l: 0.95 };
    private lumierHemiPosition = { x: 0, y: 500, z: 0 };
    private lumierDirePosition = { x: -1, y: 0.75, z: 1 };
    private scalaire = 30;
    private toucheD = 100;
    private toucheA = 97;
    private lumiereHemisphere: HemisphereLight;
    private lumiereDirectionnelle: DirectionalLight;

    private creeLumiereHemisphere(): HemisphereLight {

        this.lumiereHemisphere = new HemisphereLight(this.couleurCiel, this.couleurTerre, this.intensité);
        this.lumiereHemisphere.color.setHSL(this.hemiCoulour.h, this.hemiCoulour.s, this.hemiCoulour.l);
        this.lumiereHemisphere.groundColor.setHSL(this.hemiCoulourTerre.h, this.hemiCoulourTerre.s, this.hemiCoulourTerre.l);
        this.lumiereHemisphere.position.set(this.lumierHemiPosition.x, this.lumierHemiPosition.y, this.lumierHemiPosition.z);
        return this.lumiereHemisphere;
    }

    private creeLumierDirectionnel(): DirectionalLight {

        this.lumiereDirectionnelle = new DirectionalLight(this.hex, this.intensitée);
        this.lumiereDirectionnelle.color.setHSL(this.directionCoulour.h, this.directionCoulour.s, this.directionCoulour.l);
        this.lumiereDirectionnelle.position.set(this.lumierDirePosition.x, this.lumierDirePosition.y, this.lumierDirePosition.z);
        this.lumiereDirectionnelle.position.multiplyScalar(this.scalaire);
        this.lumiereDirectionnelle.castShadow = true;
        return this.lumiereDirectionnelle;
    }

    public ajouterLumierScene(scene: Scene): void {
        scene.add(this.lumiereDirectionnelle);
        scene.add(this.lumiereHemisphere);
    }

    public modeJourNuit(event, scene: Scene): void {
        if (event.keyCode === this.toucheD) {
            // d
            scene.background = ImageUtils.loadTexture('../../assets/textures/téléchargement.jpeg');
            this.lumiereDirectionnelle.visible = true;
        }

        if (event.keyCode === this.toucheA) {
            // a
            scene.background = ImageUtils.loadTexture('../../assets/textures/missions_bg_image.jpg');
            this.lumiereDirectionnelle.visible = false;
        }
    }
}

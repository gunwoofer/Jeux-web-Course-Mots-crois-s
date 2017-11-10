import { Injectable } from '@angular/core';
import { HemisphereLight, DirectionalLight, ImageUtils, Scene } from 'three';
import { Voiture } from '../voiture/Voiture';

export const PHARES = [
    'BrakeLightLS1', 'BrakeLightRS1', 'Lumière Avant Droite', 'Lumière Avant Gauche', 'Phare Droit', 'Phare Gauche'];

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
    public lumiereHemisphere: HemisphereLight;
    public lumiereDirectionnelle: DirectionalLight;

    constructor() {
        this.creeLumierDirectionnel();
        this.creeLumiereHemisphere();
    }

    public creeLumiereHemisphere(): void {
        this.lumiereHemisphere = new HemisphereLight(this.couleurCiel, this.couleurTerre, this.intensité);
        this.lumiereHemisphere.color.setHSL(this.hemiCoulour.h, this.hemiCoulour.s, this.hemiCoulour.l);
        this.lumiereHemisphere.groundColor.setHSL(this.hemiCoulourTerre.h, this.hemiCoulourTerre.s, this.hemiCoulourTerre.l);
        this.lumiereHemisphere.position.set(this.lumierHemiPosition.x, this.lumierHemiPosition.y, this.lumierHemiPosition.z);
    }

    public creeLumierDirectionnel(): void {
        this.lumiereDirectionnelle = new DirectionalLight(this.hex, this.intensitée);
        this.lumiereDirectionnelle.color.setHSL(this.directionCoulour.h, this.directionCoulour.s, this.directionCoulour.l);
        this.lumiereDirectionnelle.position.set(this.lumierDirePosition.x, this.lumierDirePosition.y, this.lumierDirePosition.z);
        this.lumiereDirectionnelle.position.multiplyScalar(this.scalaire);
        this.lumiereDirectionnelle.castShadow = true;
    }

    public ajouterLumierScene(scene: Scene): void {
        scene.add(this.lumiereDirectionnelle);
        scene.add(this.lumiereHemisphere);
    }

    public modeJourNuit(event, scene: Scene): void {
        this.lumiereDirectionnelle.visible = !this.lumiereDirectionnelle.visible;
        scene.background = this.lumiereDirectionnelle.visible ? ImageUtils.loadTexture('../../assets/textures/day.jpeg') :
            ImageUtils.loadTexture('../../assets/textures/night.jpg');
    }

    public alternerPhares(voiture: Voiture): void {
        for (let i = 0; i < PHARES.length; i++) {
            const phareVisible = voiture.voiture3D.getObjectByName(PHARES[i]).visible;
            voiture.voiture3D.getObjectByName(PHARES[i]).visible = !phareVisible;
        }
    }
}

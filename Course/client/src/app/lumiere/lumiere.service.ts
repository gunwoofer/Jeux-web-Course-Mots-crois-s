import { PHARES } from './../constant';
import { Injectable } from '@angular/core';
import { HemisphereLight, DirectionalLight, PointLight, SpotLight, ImageUtils, Scene } from 'three';
import { Voiture } from '../voiture/Voiture';

@Injectable()
export class LumiereService {

    private couleurCiel = 0xfd720f;
    private couleurTerre = 0xffffff;
    private couleurLumierePhare = 0xffffff;
    private intensité = 0.6;
    private hex = 0xffffff;
    private intensitée = 1;
    private hemiCoulour = { h: 0.6, s: 0.75, l: 0.5 };
    private hemiCoulourTerre = { h: 0.095, s: 0.5, l: 0.5 };
    private directionCoulour = { h: 0.1, s: 1, l: 0.95 };
    private lumierHemiPosition = { x: 0, y: 500, z: 0 };
    private lumierDirePosition = { x: -1, y: 0.75, z: 1 };
    private lumierPointPosition = { x: 2.7, y: 1, z: 0.6 };
    private lumierSpotPosition = { x: 3, y: 1.5, z: 0.6 };
    private lumierSpotTargetPosition = { x: 6, y: 0.5, z: 1 };
    private intensitéLumierePoint = 0.5;
    private distanceLumierePoint = 5;
    private intensitéLumiereSpot = 2;
    private angleLumiereSpot = 0.5;
    private distanceLumiereSpot = 80;
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

    public creerPhare(nom: string, cote: number): PointLight {
        const phare = new PointLight(this.couleurLumierePhare, this.intensitéLumierePoint, this.distanceLumierePoint);
        phare.name = nom;
        phare.position.set(this.lumierPointPosition.x, this.lumierPointPosition.y, cote * this.lumierPointPosition.z);
        phare.rotation.set(Math.PI, Math.PI, -Math.PI);
        return phare;
    }

    public creerLumiereAvant(nom: string, cote: number): SpotLight {
        const lumiereAvant = new SpotLight(this.couleurLumierePhare, this.intensitéLumiereSpot);
        lumiereAvant.name = nom;
        lumiereAvant.position.set(this.lumierSpotPosition.x, this.lumierSpotPosition.y, cote * this.lumierSpotPosition.z);
        lumiereAvant.angle = this.angleLumiereSpot;
        lumiereAvant.target.position.set(this.lumierSpotTargetPosition.x, this.lumierSpotTargetPosition.y,
            cote * this.lumierSpotTargetPosition.z);
        lumiereAvant.distance = this.distanceLumiereSpot;
        return lumiereAvant;
    }
}

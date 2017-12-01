import { PHARES, COULEUR_CIEL, COULEUR_TERRE, COULEUR_PHARE, JOUR_TEXTURE, NUIT_TEXTURE } from './../constant';
import { Injectable } from '@angular/core';
import { HemisphereLight, DirectionalLight, PointLight, SpotLight, ImageUtils, Scene } from 'three';
import { Voiture } from '../voiture/Voiture';

const scalaire = 30;
const intensitéLumierePoint = 0.5;
const distanceLumierePoint = 5;
const intensitéLumiereSpot = 2;
const angleLumiereSpot = 0.5;
const distanceLumiereSpot = 80;
const intensitée = 1;
const hex = 0xffffff;
const intensité = 0.6;

@Injectable()
export class LumiereService {

    public lumiereHemisphere: HemisphereLight;
    public lumiereDirectionnelle: DirectionalLight;

    private hemiCoulour = { h: 0.6, s: 0.75, l: 0.5 };
    private hemiCoulourTerre = { h: 0.095, s: 0.5, l: 0.5 };
    private directionCoulour = { h: 0.1, s: 1, l: 0.95 };
    private lumierHemiPosition = { x: 0, y: 500, z: 0 };
    private lumierDirePosition = { x: -1, y: 0.75, z: 1 };
    private lumierPointPosition = { x: 2.7, y: 1, z: 0.6 };
    private lumierSpotPosition = { x: 3, y: 1.5, z: 0.6 };
    private lumierSpotTargetPosition = { x: 6, y: 0.5, z: 1 };

    constructor() {
        this.creeLumierDirectionnel();
        this.creeLumiereHemisphere();
    }

    public ajouterLumierScene(scene: Scene): void {
        scene.add(this.lumiereDirectionnelle);
        scene.add(this.lumiereHemisphere);
    }

    public modeJourNuit(event, scene: Scene): void {
        this.lumiereDirectionnelle.visible = !this.lumiereDirectionnelle.visible;
        scene.background = this.lumiereDirectionnelle.visible ? ImageUtils.loadTexture(JOUR_TEXTURE) :
            ImageUtils.loadTexture(NUIT_TEXTURE);
    }

    public alternerPhares(voiture: Voiture): void {
        for (let phare = 0; phare < PHARES.length; phare++) {
            const phareVisible = voiture.voiture3D.getObjectByName(PHARES[phare]).visible;
            voiture.voiture3D.getObjectByName(PHARES[phare]).visible = !phareVisible;
        }
    }

    public creerPhare(nom: string, cote: number): PointLight {
        const phare = new PointLight(COULEUR_PHARE, intensitéLumierePoint, distanceLumierePoint);
        phare.name = nom;
        phare.position.set(this.lumierPointPosition.x, this.lumierPointPosition.y, cote * this.lumierPointPosition.z);
        phare.rotation.set(Math.PI, Math.PI, -Math.PI);
        return phare;
    }

    public creerLumiereAvant(nom: string, cote: number): SpotLight {
        const lumiereAvant = new SpotLight(COULEUR_PHARE, intensitéLumiereSpot);
        lumiereAvant.name = nom;
        lumiereAvant.position.set(this.lumierSpotPosition.x, this.lumierSpotPosition.y, cote * this.lumierSpotPosition.z);
        lumiereAvant.angle = angleLumiereSpot;
        lumiereAvant.target.position.set(this.lumierSpotTargetPosition.x, this.lumierSpotTargetPosition.y,
            cote * this.lumierSpotTargetPosition.z);
        lumiereAvant.distance = distanceLumiereSpot;
        return lumiereAvant;
    }

    private creeLumiereHemisphere(): void {
        this.lumiereHemisphere = new HemisphereLight(COULEUR_CIEL, COULEUR_TERRE, intensité);
        this.lumiereHemisphere.color.setHSL(this.hemiCoulour.h, this.hemiCoulour.s, this.hemiCoulour.l);
        this.lumiereHemisphere.groundColor.setHSL(this.hemiCoulourTerre.h, this.hemiCoulourTerre.s, this.hemiCoulourTerre.l);
        this.lumiereHemisphere.position.set(this.lumierHemiPosition.x, this.lumierHemiPosition.y, this.lumierHemiPosition.z);
    }

    private creeLumierDirectionnel(): void {
        this.lumiereDirectionnelle = new DirectionalLight(hex, intensitée);
        this.lumiereDirectionnelle.color.setHSL(this.directionCoulour.h, this.directionCoulour.s, this.directionCoulour.l);
        this.lumiereDirectionnelle.position.set(this.lumierDirePosition.x, this.lumierDirePosition.y, this.lumierDirePosition.z);
        this.lumiereDirectionnelle.position.multiplyScalar(scalaire);
        this.lumiereDirectionnelle.castShadow = true;
    }
}

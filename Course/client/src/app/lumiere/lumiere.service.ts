import { LUMIERE_DIRECTIONNELLE_NOM, LUMIERE_HEMISPHERE_NOM } from './../constant';
import { Injectable } from '@angular/core';
import { HemisphereLight, DirectionalLight, PointLight, SpotLight, ImageUtils, Scene } from 'three';
import { Voiture } from '../voiture/Voiture';
import { NUIT_TEXTURE, JOUR_TEXTURE, PHARES, COULEUR_PHARE, 
    INTENSITE_LUMIERE_POINT, DISTANCE_LUMIERE_POINT, LUMIERE_POINT_POSITION,
    INTENSITE_LUMIERE_SPOT, LIMIERE_SPOT_POSITION, ANGLE_LUMIERE_SPOT, LIMIERE_SPOT_TARGET_POSITION,
    DISTANCE_LUMIERE_SPOT, COULEUR_CIEL, COULEUR_TERRE, INTENSITE, HEMISPHERE_COULEURTERRE, HEMISPHERE_COULEUR,
    LUMIERE_HEMISPHERE_POSITION, HEX, INTENSITEE, DIRECTION_COULEUR, SCALAIRE, LUMIERE_DIRECITON_POSITION,
    LUMIERES, LUMIERE_AVANT_DROITE, LUMIERE_AVANT_GAUCHE, PHARE_DROITE, PHARE_GAUCHE } from '../constant';


@Injectable()
export class LumiereService {

    public static jour = true;
    public static phares = false;

    public static ajouterPhares(objet: THREE.Object3D): void {
        const lumiereDroite = this.creerLumiereAvant(LUMIERE_AVANT_DROITE, 1);
        objet.add(lumiereDroite);
        objet.add(lumiereDroite.target);
        const lumiereGauche = LumiereService.creerLumiereAvant(LUMIERE_AVANT_GAUCHE, -1);
        objet.add(lumiereGauche);
        objet.add(lumiereGauche.target);
        objet.add(this.creerPhare(PHARE_DROITE, 1));
        objet.add(this.creerPhare(PHARE_GAUCHE, -1));
    }

    public static creerPhare(nom: string, cote: number): PointLight {
        const phare = new PointLight(COULEUR_PHARE, INTENSITE_LUMIERE_POINT, DISTANCE_LUMIERE_POINT);
        phare.name = nom;
        phare.position.set(LUMIERE_POINT_POSITION.x, LUMIERE_POINT_POSITION.y, cote * LUMIERE_POINT_POSITION.z);
        phare.rotation.set(Math.PI, Math.PI, -Math.PI);
        return phare;
    }

    public static logiquePhares(voiture: Voiture): void {
        if (!LumiereService.phares && LumiereService.jour) {
            LumiereService.phares = !LumiereService.phares;
            LumiereService.alternerPhares(voiture);
        } else if (LumiereService.phares && !LumiereService.jour) {
            LumiereService.phares = !LumiereService.phares;
            LumiereService.alternerPhares(voiture);
        }
    }

    public static creerLumiereAvant(nom: string, cote: number): SpotLight {
        const lumiereAvant = new SpotLight(COULEUR_PHARE, INTENSITE_LUMIERE_SPOT);
        lumiereAvant.name = nom;
        lumiereAvant.position.set(LIMIERE_SPOT_POSITION.x, LIMIERE_SPOT_POSITION.y, cote * LIMIERE_SPOT_POSITION.z);
        lumiereAvant.angle = ANGLE_LUMIERE_SPOT;
        lumiereAvant.target.position.set(LIMIERE_SPOT_TARGET_POSITION.x, LIMIERE_SPOT_TARGET_POSITION.y,
            cote * LIMIERE_SPOT_TARGET_POSITION.z);
        lumiereAvant.distance = DISTANCE_LUMIERE_SPOT;
        return lumiereAvant;
    }

    public static ajouterLumierScene(scene: Scene): void {
        scene.add(this.creeLumierDirectionnel());
        scene.add(this.creeLumiereHemisphere());
    }

    public static modeJourNuit(event, scene: Scene): void {
        const lumiereDirectionnelle = scene.getChildByName('lumiereDirectionnelle');
        lumiereDirectionnelle.visible = !lumiereDirectionnelle.visible;
        scene.background = lumiereDirectionnelle.visible ? ImageUtils.loadTexture(JOUR_TEXTURE) :
            ImageUtils.loadTexture(NUIT_TEXTURE);
    }

    public static alternerPhares(voiture: Voiture): void {
        for (let phare = 0; phare < PHARES.length; phare++) {
            const phareVisible = voiture.voiture3D.getObjectByName(PHARES[phare]).visible;
            voiture.voiture3D.getObjectByName(PHARES[phare]).visible = !phareVisible;
        }
    }

    public static eteindreTousLesPhares(objet: THREE.Object3D): void {
        for (let lumiere = 0; lumiere < LUMIERES.length; lumiere++) {
            objet.getObjectByName(LUMIERES[lumiere]).visible = false;
        }
    }

    private static creeLumiereHemisphere(): HemisphereLight {
        const lumiereHemisphere = new HemisphereLight(COULEUR_CIEL, COULEUR_TERRE, INTENSITE);

        lumiereHemisphere.color.setHSL(HEMISPHERE_COULEUR.h, HEMISPHERE_COULEUR.s, HEMISPHERE_COULEUR.l);
        lumiereHemisphere.groundColor.setHSL(HEMISPHERE_COULEURTERRE.h, HEMISPHERE_COULEURTERRE.s, HEMISPHERE_COULEURTERRE.l);
        lumiereHemisphere.position.set(LUMIERE_HEMISPHERE_POSITION.x, LUMIERE_HEMISPHERE_POSITION.y, LUMIERE_HEMISPHERE_POSITION.z);
        lumiereHemisphere.name = LUMIERE_HEMISPHERE_NOM;

        return lumiereHemisphere;
    }

    private static creeLumierDirectionnel(): DirectionalLight {
        const lumiereDirectionnelle = new DirectionalLight(HEX, INTENSITEE);
        lumiereDirectionnelle.color.setHSL(DIRECTION_COULEUR.h, DIRECTION_COULEUR.s, DIRECTION_COULEUR.l);
        lumiereDirectionnelle.position.set(LUMIERE_DIRECITON_POSITION.x, LUMIERE_DIRECITON_POSITION.y, LUMIERE_DIRECITON_POSITION.z);
        lumiereDirectionnelle.position.multiplyScalar(SCALAIRE);
        lumiereDirectionnelle.castShadow = true;
        lumiereDirectionnelle.name = LUMIERE_DIRECTIONNELLE_NOM;

        return lumiereDirectionnelle;
    }
}

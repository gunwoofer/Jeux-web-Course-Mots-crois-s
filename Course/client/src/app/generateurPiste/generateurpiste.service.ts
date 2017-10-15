import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/voiture.service';

export const LARGEUR_PISTE = 50;
export const NOMBRE_SEGMENTS = 1;

@Injectable()
export class GenerateurPisteService {
    private container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    private pointsPiste: THREE.Vector3[][];
    private origine: THREE.Vector3;
    private voiture: THREE.Mesh;
    private automobile: Voiture;
    private objetVoiture: THREE.Mesh;
    private touche: number;
    private touchePrecedente: number;

    public initialisation(container: HTMLDivElement) {
        this.origine = new THREE.Vector3(0, 0, 0);
        this.pointsPiste = new Array(NOMBRE_SEGMENTS);
        for (let i = 0; i < this.pointsPiste.length; i++) {
            this.pointsPiste[i] = new Array();
        }
        this.automobile = new Voiture(this.objetVoiture);
        this.container = container;
        this.creerScene();
        this.creerPointMock();
         //this.creerVoiture();
        //this.ajoutVoiture();
        this.automobile.creerVoiture();
        console.log(this.automobile.obtenirObjetVoiture3D());
        this.scene.add(this.automobile.obtenirObjetVoiture3D());
        this.commencerRendu();
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x00FF00);
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 1000);
        this.camera.position.y = 0;
        this.camera.position.x = 0;
        this.camera.position.z = 350;
    }

    public commencerRendu(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    public render(): void {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    public creerVoiture(): void {
        const geometry = new THREE.BoxGeometry( 10, 10, 10);
        const loader = new THREE.TextureLoader();
        const texture = loader.load('../../assets/textures/clouds.jpg');

        const material = new THREE.MeshBasicMaterial( { color: 'white', overdraw: 0.5, map: texture } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.y = 10;
        cube.position.x = 0;
        cube.position.z = 0;
        this.voiture = cube;

    }

    public creerPointMock(): void {

        this.pointsPiste[0][0] = new THREE.Vector3(0, 0, 0);
        this.pointsPiste[0][1] = new THREE.Vector3(0, 100, 0);

    }

    public ajoutPlan(): void {
        const largeur = LARGEUR_PISTE;
        const materiel = new THREE.MeshBasicMaterial( { color : 'black' } );

        for (const duoPoint of this.pointsPiste) {
            const pointDebut: THREE.Vector3 = duoPoint[0];
            const pointFin: THREE.Vector3 = duoPoint[1];

            const longueur = this.obtenirLongueur(pointDebut, pointFin);
            const geometrie = new THREE.PlaneGeometry(largeur, longueur);
            const angle = this.obtenirAngle(pointDebut, pointFin);
            const plan = new THREE.Mesh(geometrie, materiel);
            plan.rotateZ(angle);
            plan.position.x = (pointDebut.x + pointFin.x) / 2;
            plan.position.y = (pointDebut.y + pointFin.y) / 2;
            this.scene.add(plan);
        }
        this.camera.lookAt(this.origine);
    }

    private obtenirLongueur(pointDebut: THREE.Vector3, pointFin: THREE.Vector3): number {
        const longueur: number = Math.sqrt(
            Math.pow(pointFin.x - pointDebut.x, 2) + Math.pow(pointFin.y - pointDebut.y, 2) + Math.pow(pointFin.z - pointDebut.z, 2)
        );
        return longueur;
    }

    private obtenirAngle(pointDebut: THREE.Vector3, pointFin: THREE.Vector3): number {
        const angle: number = Math.atan((pointFin.y - pointDebut.y) / (pointFin.x - pointDebut.x));
        return angle;
    }

    public cameraAvantArriere(event) {
        if (event.wheelDeltaY < 0) {
            this.camera.position.z += 5;
        } else {
                this.camera.position.z -= 5;
        }
    }

    private afficherPointConsole(point: THREE.Vector3): void {
        console.log('Coordonnees du point : x = ' + point.x + ' y = ' + point.y + ' z = ' + point.z );
    }

    public deplacementVoiture(event) {
        // console.log(event.keyCode);
        /*
        Gauche = 97
        Droite = 100
        Avancer = 119
        Reculer = 115
        */
        if (event.keyCode === 119) {
            console.log('Avancer');
            this.automobile.obtenirObjetVoiture3D().translateY(1);
            this.touchePrecedente = this.touche;
            this.touche = 119;
            console.log("event.keyCode = :" + event.keyCode);
            console.log("touche : " + this.touche);
            if(this.touchePrecedente === 97){
                console.log('Avancer -> ensuite (Gauche)')
                this.automobile.obtenirObjetVoiture3D().translateX(-1); 
                this.touche = 97;
                event.keyCode = 97;
                console.log("touche : " + this.touche);
                console.log("event.keyCode = :" + event.keyCode);
                
            }
            if (this.touchePrecedente === 100) {
                console.log('Avancer -> ensuite (Droite)?')
                this.automobile.obtenirObjetVoiture3D().translateX(1);
                this.touche = 100;
                console.log("touche : " + this.touche);
                console.log("event.keyCode = :" + event.keyCode);
            }
        }
        if (event.keyCode === 115) {
            console.log('Reculer');
            this.automobile.obtenirObjetVoiture3D().translateY(-1);
            this.touchePrecedente = this.touche;
            this.touche=115;
            console.log("touche : " + this.touche);
            console.log("event.keyCode = :" + event.keyCode);
           if(this.touchePrecedente === 97){
                console.log('Reculer -> ensuite (Gauche)')
                this.automobile.obtenirObjetVoiture3D().translateX(-1);
                this.touche = 97; 
                console.log("touche : " + this.touche);
                console.log("event.keyCode = :" + event.keyCode);
            }
            if(this.touchePrecedente === 100){
                console.log('Reculer -> ensuite (Droite)')
                this.automobile.obtenirObjetVoiture3D().translateX(1); 
                this.touche = 100;
                console.log("touche : " + this.touche);
                console.log("event.keyCode = :" + event.keyCode);
            }
        }
        if (event.keyCode === 97) {
            console.log('Gauche');
            this.touchePrecedente = this.touche;
            this.touche = 97 ;
            console.log("event.keyCode = :" + event.keyCode);
            console.log("touche : " + this.touche);
            this.automobile.obtenirObjetVoiture3D().translateX(-1);

            //this.touche=113;
            if (this.touchePrecedente === 119) {
                console.log('Gauche -> ensuite Avancer')
                this.automobile.obtenirObjetVoiture3D().translateY(1);
                this.touche = 119;
                console.log("touche : " + this.touche);
                console.log("event.keyCode = :" + event.keyCode);
            }
            if (this.touchePrecedente === 115) {
                console.log('Gauche -> ensuite Reculer?')
                this.automobile.obtenirObjetVoiture3D().translateY(-1);
                this.touche = 115;
                console.log("touche : " + this.touche);
                console.log("event.keyCode = :" + event.keyCode);
            }
        }
        if (event.keyCode === 100 ) {
            console.log('Droite');
            this.touchePrecedente = this.touche;
            this.touche = 100;
            // this.voiture.rotateZ(-0.1);
            this.automobile.obtenirObjetVoiture3D().translateX(1);
          //  this.touche = 100;
            console.log("touche : " + this.touche);
            console.log("event.keyCode = :" + event.keyCode);
            if (this.touchePrecedente === 119) {
                console.log('Droite -> ensuite avancer');
                this.automobile.obtenirObjetVoiture3D().translateY(1);
                this.touche = 119;
                console.log("touche : " + this.touche);
               console.log("event.keyCode = :" + event.keyCode);
               
            }
            if (this.touchePrecedente === 115) {
                 console.log('Droite -> ensuite reculer')
                this.automobile.obtenirObjetVoiture3D().translateY(-1);
                this.touche = 115;
                console.log("touche : " + this.touche);
                console.log("event.keyCode = :" + event.keyCode);
            }
        }
    
    }

    public toucheRelachee(event) {
        console.log(event.keyCode);
        // 90 Z
        // 83 S
        // 68 D
        // 81 Q
        // 65 A
        // 87 W
       if (event.keyCode === 87) {
            console.log('Touche AVANT relachée');
            this.touche = 0;
        }
        if (event.keyCode === 83) {
            console.log('Touche ARRIERE relachée');
            this.touche = 0;
        }
        if (event.keyCode === 65){
            console.log('Touche GAUCHE relachée');
            this.touche = 0;    
        }
        if (event.keyCode === 68){
            console.log('Touche DROITE relachée');
            this.touche = 0;    
        }

    }

    public ajoutVoiture() {
        const loader = new THREE.ObjectLoader();
        loader.load('../../assets/modeles/audi/audioptimised02.json', ( obj ) => {
            this.scene.add( obj );
            this.camera.lookAt(obj.position);
        });

    }
}

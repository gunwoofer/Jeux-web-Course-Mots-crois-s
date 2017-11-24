import { Retroviseur } from './../gestionnaireDeVue/retroviseur';


export class Rendu {

    public commencerRendu(renderer: THREE.WebGLRenderer, container: HTMLDivElement): void {
        renderer.setPixelRatio(devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
    }

    public ajusterCadre(renderer: THREE.WebGLRenderer, params: any,
        camera: THREE.PerspectiveCamera, scene: THREE.Scene): void {
        renderer.setScissorTest(true);
        this.verifierElement(params, renderer);
        renderer.render(scene, camera);
    }

    public verifierElement(parametre: any, renderer: THREE.WebGLRenderer): void {
        if (parametre instanceof Retroviseur) {
            renderer.setViewport(parametre.coinX, parametre.coinY,
                parametre.largeur, parametre.hauteur);
            renderer.setScissor(parametre.coinX, parametre.coinY,
                parametre.largeur, parametre.hauteur);
        } else if (parametre instanceof HTMLDivElement) {
            renderer.setViewport(0, 0, parametre.clientWidth, parametre.clientHeight);
            renderer.setScissor(0, 0, parametre.clientWidth, parametre.clientHeight);
        }
    }

}

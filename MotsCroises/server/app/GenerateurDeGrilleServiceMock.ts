import {GenerateurDeGrilleService} from './GenerateurDeGrilleService';
import { Niveau } from '../../commun/Niveau';
import { Grille } from './Grille';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { Indice } from './Indice';
import { MotComplet } from './MotComplet';

export class GenerateurDeGrilleServiceMock extends GenerateurDeGrilleService {

    constructor() {
        super();
    }

    public genererGrilleMock(niveau: Niveau): Grille {
        this.motCroiseGenere = this.genererGrilleVideMock(niveau);
        this.motCroiseGenere = this.remplirGrilleMock(niveau);

        return this.motCroiseGenere;
    }

    private genererGrilleVideMock(niveau: Niveau): Grille {
        const grilleMock: Grille = new Grille(niveau);

        // Emplacements horizontaux
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.cases.obtenirCase(2, 6), grilleMock.cases.obtenirCase(2, 9)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.cases.obtenirCase(3, 0), grilleMock.cases.obtenirCase(3, 3)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.cases.obtenirCase(5, 0), grilleMock.cases.obtenirCase(5, 8)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.cases.obtenirCase(8, 3), grilleMock.cases.obtenirCase(8, 9)));

        // Emplacements verticaux
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.cases.obtenirCase(1, 1), grilleMock.cases.obtenirCase(9, 1)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.cases.obtenirCase(0, 3), grilleMock.cases.obtenirCase(6, 3)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.cases.obtenirCase(3, 5), grilleMock.cases.obtenirCase(6, 5)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.cases.obtenirCase(5, 7), grilleMock.cases.obtenirCase(8, 7)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.cases.obtenirCase(1, 8), grilleMock.cases.obtenirCase(5, 8)));

        return grilleMock;
    }

    private remplirGrilleMock(niveau: Niveau): Grille {
        let grilleRemplieMock: Grille = this.motCroiseGenere;

        // Mots horizontaux:
        const indice1H = new Indice(['a firm controlling influence',
            'worker who moves the camera around while a film or television show is being made']);
        const mot1H = new MotComplet('GRIP', indice1H);
        const indice2H = new Indice(['tool consisting of a combination of implements arranged to work together',
            'an organized group of workmen']);
        const mot2H = new MotComplet('GANG', indice2H);
        const indice3H = new Indice(['man-made equipment that orbits around the earth or the moon',
            'any celestial body orbiting around a planet or star']);
        const mot3H = new MotComplet('SATELLITE', indice3H);
        const indice4H = new Indice(['the point on a curve where the tangent changes from negative on the left to positive on the right',
            'the smallest possible quantity']);
        const mot4H = new MotComplet('MINIMUM', indice4H);

        // Mots verticaux:
        const indice1V = new Indice(
            ['a written assurance that some product or service will be provided or will meet certain specifications',
                'a pledge that something will happen or that something is true']);
        const mot1V = new MotComplet('GUARANTEE', indice1V);
        const indice2V = new Indice(['cheap showy jewelry or ornament on clothing', 'jewelry worn around the wrist for decoration']);
        const mot2V = new MotComplet('BANGLES', indice2V);
        const indice3V = new Indice(['a sacred place of pilgrimage', 'belonging to or derived from or associated with a divine power']);
        const mot3V = new MotComplet('HOLY', indice3V);
        const indice4V = new Indice(['uncastrated adult male sheep', 'a tool for driving or forcing something by impact']);
        const mot4V = new MotComplet('TRAM', indice4V);
        const indice5V = new Indice(['a book regarded as authoritative in its field', 'the sacred writings of the Christian religions']);
        const mot5V = new MotComplet('BIBLE', indice5V);

        for (let i = 0; i < grilleRemplieMock.emplacementMots.length; i++) {
            // Parcourt horizontal puis vertical de bas en haut et de gauche a droite
            if (i === 0) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice1H.id);
                grilleRemplieMock.ajouterMotEmplacement(mot1H, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 1) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice2H.id);
                grilleRemplieMock.ajouterMotEmplacement(mot2H, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 2) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice3H.id);
                grilleRemplieMock.ajouterMotEmplacement(mot3H, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 3) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice4H.id);
                grilleRemplieMock.ajouterMotEmplacement(mot4H, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 4) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice1V.id);
                grilleRemplieMock.ajouterMotEmplacement(mot1V, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 5) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice2V.id);
                grilleRemplieMock.ajouterMotEmplacement(mot2V, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 6) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice3V.id);
                grilleRemplieMock.ajouterMotEmplacement(mot3V, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 7) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice4V.id);
                grilleRemplieMock.ajouterMotEmplacement(mot4V, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 8) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice5V.id);
                grilleRemplieMock.ajouterMotEmplacement(mot5V, grilleRemplieMock.emplacementMots[i]);
            }
        }

        grilleRemplieMock = this.ajouterIntersectionsMock(grilleRemplieMock);
        return grilleRemplieMock;
    }

    private ajouterIntersectionsMock(grille: Grille): Grille {
        grille.cases.obtenirCase(2, 8).intersection = true;
        grille.cases.obtenirCase(3, 1).intersection = true;
        grille.cases.obtenirCase(3, 3).intersection = true;
        grille.cases.obtenirCase(5, 1).intersection = true;
        grille.cases.obtenirCase(5, 3).intersection = true;
        grille.cases.obtenirCase(5, 5).intersection = true;
        grille.cases.obtenirCase(5, 7).intersection = true;
        grille.cases.obtenirCase(5, 8).intersection = true;
        grille.cases.obtenirCase(8, 7).intersection = true;

        return grille;
    }
}

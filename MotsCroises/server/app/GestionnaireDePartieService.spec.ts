import { assert } from 'chai';
import { Joueur } from './Joueur';
import { Case } from './Case';
import { EmplacementMot } from './EmplacementMot';
import { Grille } from './Grille';
import { TypePartie, Partie } from './Partie';
import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { PersistenceGrillesService } from './PersistenceGrillesService';
import { Niveau } from './Grille';

export const maxDelaiRetourRequeteMS = 10000;

describe('GestionnaireDePartieService', () => {

    it('Il est possible de créer une partie classique pour un joueur.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.classique;
        const generateurDeGrilleService:GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateurDeGrilleService);
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';

        persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.facile)
            .then((grilleDepart)=>{
                guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);

                assert(gestionniareDePartieService.obtenirPartieEnCours(guidPartie) !== undefined);
                done();
            })
            .catch((erreur) => {
                console.log(erreur);
                assert(false);
                done();
            });

    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible de créer une partie dynamique pour un joueur.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique;
        const generateurDeGrilleService:GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateurDeGrilleService);
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';

        persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.facile)
            .then((grilleDepart)=>{
                guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);

                assert(gestionniareDePartieService.obtenirPartieEnCours(guidPartie) !== undefined);
                done();
            })
            .catch((erreur) => {
                console.log(erreur);
                assert(false);
                done();
            });
    }).timeout(maxDelaiRetourRequeteMS);
    
    it('Il est possible de vérifier un mauvais mot dans la grille.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique;
        const generateurDeGrilleService:GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateurDeGrilleService);
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';

        persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.facile)
            .then((grilleDepart: Grille)=>{
                guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
                const emplacementsMot: EmplacementMot[] = grilleDepart.emplacementsHorizontaux();
                const emplacementMot: EmplacementMot = emplacementsMot[0];
                const caseDebut: Case = emplacementMot.obtenirCaseDebut();
                const caseFin: Case = emplacementMot.obtenirCaseFin();
                const longueurMot: number = emplacementMot.obtenirGrandeur();
                let motAVerifier: string;

                for(let i = 0; i < longueurMot; i++) {
                    motAVerifier += 'a';
                }

                assert(!gestionniareDePartieService.estLeMot(caseDebut, caseFin, motAVerifier, guidPartie, joueur.obtenirGuid()));
                done();
            })
            .catch((erreur) => {
                console.log(erreur);
                assert(false);
                done();
            });
    }).timeout(maxDelaiRetourRequeteMS);
    
    it('Il est possible de vérifier un bon mot dans la grille.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique;
        const generateurDeGrilleService:GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateurDeGrilleService);
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        let grilleDepart: Grille = generateurDeGrilleService.genererGrille(Niveau.difficile);

        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
        const emplacementsMot: EmplacementMot[] = grilleDepart.obtenirEmplacementsMot();
        const emplacementMot: EmplacementMot = emplacementsMot[0];
        const caseDebut: Case = emplacementMot.obtenirCaseDebut();
        const caseFin: Case = emplacementMot.obtenirCaseFin();
        const longueurMot: number = emplacementMot.obtenirGrandeur();
        let motAVerifier: string = '';

        for(let i = 0; i < longueurMot; i++) {
            motAVerifier = motAVerifier + 'A';
        }
        //console.log(motAVerifier);
        grilleDepart.obtenirCases()[0][0].remplirCase('BOB');
        console.log("DANS LE TEST ::");
        console.log("DANS LA GRILLE");
        console.log(grilleDepart.obtenirCases()[0][0]);
        assert(gestionniareDePartieService.estLeMot(caseDebut, caseFin, motAVerifier, guidPartie, joueur.obtenirGuid()));
        done();

    }).timeout(maxDelaiRetourRequeteMS);
    
});

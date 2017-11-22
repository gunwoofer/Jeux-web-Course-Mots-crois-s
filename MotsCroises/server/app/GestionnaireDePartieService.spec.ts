import { assert } from 'chai';
import { Joueur } from '../../commun/Joueur';
import { Case } from '../../commun/Case';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { Grille } from './Grille';
import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { GenerateurDeGrilleServiceMock } from './GenerateurDeGrilleServiceMock';
import { PersistenceGrillesService } from './PersistenceGrillesService';
import { Niveau } from '../../commun/Niveau';
import { TypePartie } from '../../commun/TypePartie';
import { SpecificationPartie } from '../../commun/SpecificationPartie';
import { DescripteurEvenementTempsReel } from './DescripteurEvenementTempsReel';

export const maxDelaiRetourRequeteMS = 10000;

describe('GestionnaireDePartieService', () => {

    it('Il est possible de créer une partie classique pour un joueur.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.classique_a_un;
        const generateurDeGrilleService: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
        const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateurDeGrilleService);
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';

        persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.facile)
            .then((grilleDepart) => {
                guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);

                assert(gestionniareDePartieService.obtenirPartieEnCours(guidPartie) !== undefined);
                done();
            })
            .catch((erreur) => {
                assert(false);
                done();
            });

    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible de créer une partie classique multijoueur est qu\'elle soit en attente.', () => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.classique_a_deux;
        const generateurDeGrilleService: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        const specificationPartie: SpecificationPartie = new SpecificationPartie(Niveau.facile, joueur, typePartie);
        const descripteurEvenementTempsReel: DescripteurEvenementTempsReel = new DescripteurEvenementTempsReel();
        descripteurEvenementTempsReel.preparerNouvellePartie(gestionniareDePartieService, generateurDeGrilleService, specificationPartie);

        assert(gestionniareDePartieService.obtenirPartieEnCours(specificationPartie.guidPartie)
            .obtenirPartieGuid() === specificationPartie.guidPartie);
        assert(!gestionniareDePartieService.obtenirPartieEnCours(specificationPartie.guidPartie).estDebute());
    });

    it('Il est possible de créer une partie dynamique pour un joueur.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const generateurDeGrilleService: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
        const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateurDeGrilleService);
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';

        persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.facile)
            .then((grilleDepart) => {
                guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);

                assert(gestionniareDePartieService.obtenirPartieEnCours(guidPartie) !== undefined);
                done();
            })
            .catch((erreur) => {
                assert(false);
                done();
            });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible de vérifier un mauvais mot dans la grille.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const generateurDeGrilleService: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
        const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateurDeGrilleService);
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';

        persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.facile)
            .then((grilleDepart: Grille) => {
                guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
                const emplacementsMot: EmplacementMot[] = grilleDepart.emplacementsMots.emplacementsHorizontaux();
                const emplacementMot: EmplacementMot = emplacementsMot[0];
                const caseDebut: Case = emplacementMot.obtenirCaseDebut();
                const caseFin: Case = emplacementMot.obtenirCaseFin();
                const longueurMot: number = emplacementMot.obtenirGrandeur();
                let motAVerifier: string;

                for (let i = 0; i < longueurMot; i++) {
                    motAVerifier += 'a';
                }

                assert(!gestionniareDePartieService.estLeMot(caseDebut, caseFin, motAVerifier, guidPartie, joueur.obtenirGuid()));
                done();
            })
            .catch((erreur) => {
                assert(false);
                done();
            });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible de vérifier un bon mot dans la grille.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const generateurDeGrilleService: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        generateurDeGrilleService.genererGrille(Niveau.difficile).then((grilleDepart) => {
            guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
            const emplacementsMot: EmplacementMot[] = grilleDepart.obtenirEmplacementsMot();
            const emplacementMot: EmplacementMot = emplacementsMot[0];
            const caseDebut: Case = emplacementMot.obtenirCaseDebut();
            const caseFin: Case = emplacementMot.obtenirCaseFin();
            let motAVerifier = '';
            const casesEmplacementMot: Case[] = grilleDepart.obtenirCasesSelonCaseDebut(emplacementMot.obtenirCaseDebut(),
                emplacementMot.obtenirPosition(), emplacementMot.obtenirGrandeur());
            for (const caseCourante of casesEmplacementMot) {
                motAVerifier += caseCourante.obtenirLettre();
            }
            assert(gestionniareDePartieService.estLeMot(caseDebut, caseFin, motAVerifier, guidPartie, joueur.obtenirGuid()));
            done();
        });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Un mot ne peut pas être trouvé deux fois.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const generateurDeGrilleService: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        generateurDeGrilleService.genererGrille(Niveau.difficile).then((grilleDepart) => {
            guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
            const emplacementsMot: EmplacementMot[] = grilleDepart.obtenirEmplacementsMot();
            const emplacementMot: EmplacementMot = emplacementsMot[0];
            const caseDebut: Case = emplacementMot.obtenirCaseDebut();
            const caseFin: Case = emplacementMot.obtenirCaseFin();
            let motAVerifier = '';
            const casesEmplacementMot: Case[] = grilleDepart.obtenirCasesSelonCaseDebut(emplacementMot.obtenirCaseDebut(),
                emplacementMot.obtenirPosition(), emplacementMot.obtenirGrandeur());
            for (const caseCourante of casesEmplacementMot) {
                motAVerifier += caseCourante.obtenirLettre();
            }
            gestionniareDePartieService.estLeMot(caseDebut, caseFin, motAVerifier, guidPartie, joueur.obtenirGuid());
            assert(!gestionniareDePartieService.estLeMot(caseDebut, caseFin, motAVerifier, guidPartie, joueur.obtenirGuid()));
            done();
        });
    }).timeout(maxDelaiRetourRequeteMS);



    it('Une partie solo en cours n\'est pas terminé avant que le pointage n\'égale pas le nombre de mots à trouver.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const generateurDeGrilleService: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        generateurDeGrilleService.genererGrille(Niveau.difficile).then((grilleDepart) => {
            guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
            const emplacementsMot: EmplacementMot[] = grilleDepart.obtenirEmplacementsMot();
            let casesEmplacementMot: Case[];
            let emplacementMot: EmplacementMot;
            let caseDebut: Case;
            let caseFin: Case;
            let longueurMot: number;
            let motAVerifier = '';
            // Le « -1 » est pour qu'il ne manque qu'un mot à trouver.
            for (let i = 0; i < (emplacementsMot.length - 1); i++) {
                motAVerifier = '';
                emplacementMot = emplacementsMot[i];
                caseDebut = emplacementMot.obtenirCaseDebut();
                caseFin = emplacementMot.obtenirCaseFin();
                longueurMot = emplacementMot.obtenirGrandeur();
                casesEmplacementMot = grilleDepart.obtenirCasesSelonCaseDebut(emplacementMot.obtenirCaseDebut(),
                    emplacementMot.obtenirPosition(), emplacementMot.obtenirGrandeur());

                for (const caseCourante of casesEmplacementMot) {
                    motAVerifier += caseCourante.obtenirLettre();
                }

                assert(gestionniareDePartieService.estLeMot(caseDebut, caseFin, motAVerifier, guidPartie, joueur.obtenirGuid()));

            }
            assert(!gestionniareDePartieService.voirSiPartieTermine(guidPartie));

            done();
        });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Une partie solo en cours se termine lorsque tous les mots sont trouvés.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.classique_a_un;
        const generateurDeGrilleService: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        generateurDeGrilleService.genererGrille(Niveau.difficile).then((grilleDepart) => {
            guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
            const emplacementsMot: EmplacementMot[] = grilleDepart.obtenirEmplacementsMot();
            let casesEmplacementMot: Case[];
            let emplacementMot: EmplacementMot;
            let caseDebut: Case;
            let caseFin: Case;
            let longueurMot: number;
            let motAVerifier = '';
            for (let i = 0; i < (emplacementsMot.length); i++) {
                motAVerifier = '';
                emplacementMot = emplacementsMot[i];
                caseDebut = emplacementMot.obtenirCaseDebut();
                caseFin = emplacementMot.obtenirCaseFin();
                longueurMot = emplacementMot.obtenirGrandeur();
                casesEmplacementMot = grilleDepart.obtenirCasesSelonCaseDebut(emplacementMot.obtenirCaseDebut(),
                    emplacementMot.obtenirPosition(), emplacementMot.obtenirGrandeur());
                for (const caseCourante of casesEmplacementMot) {
                    motAVerifier += caseCourante.obtenirLettre();
                }
                assert(gestionniareDePartieService.estLeMot(caseDebut, caseFin, motAVerifier, guidPartie, joueur.obtenirGuid()));
            }
            assert(gestionniareDePartieService.voirSiPartieTermine(guidPartie));
            done();
        });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible d\'obtenir les parties en cours', () => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const generateurDeGrilleService: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        generateurDeGrilleService.genererGrille(Niveau.difficile).then((grilleDepart) => {
            guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
            guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
            guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
            gestionniareDePartieService.obtenirPartieEnCours(guidPartie).demarrerPartie();
            assert(gestionniareDePartieService.obtenirPartiesEnAttente().length === 2);
        });
    });


});

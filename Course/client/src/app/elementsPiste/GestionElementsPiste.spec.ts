
import { GestionElementsPiste } from './GestionElementsPiste';
import { generate } from 'rxjs/observable/generate';

describe('GestionElementsPiste', () => {
  it('Il ne devrait pas avoir de nombre pair d\'elements de piste.', () => {
    const gestionElementsPiste: GestionElementsPiste = new GestionElementsPiste();
    for (let i = 0; i < 2; i++) {
      gestionElementsPiste.ajouterElementDePiste();
    }

    expect(gestionElementsPiste.nombreElementsEstImpair()).toBe(true);
  });

  it('Le nombre d\'elements de piste se vident lorsque l\'on depasse 5.', () => {
    const gestionElementsPiste: GestionElementsPiste = new GestionElementsPiste();
    for (let i = 0; i < 6; i++) {
      gestionElementsPiste.ajouterElementDePiste();
    }

    expect(gestionElementsPiste.obtenirNombreElements()).toBe(0);
  });
});

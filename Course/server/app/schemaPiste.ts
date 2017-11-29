import { Schema } from 'mongoose';

export const pisteSchema: Schema = new Schema({
  createdAt: { type: Date, default: Date.now },
  nom: { type: String, required: true },
  typeCourse: { type: String, required: true },
  description: { type: String, required: true },
  vignette: { type: String, required: true },
  nombreFoisJouee: { type: Number, required: true },
  coteMoyenne: { type: Number, required: false },
  coteAppreciation: { type: [], required: false },
  listeElementsDePiste: { type: [], required: false},
  meilleursTemps: { type: [], required: false },
  listepositions: { type: [], required: true },
});

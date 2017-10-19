import { Schema } from 'mongoose';

export const pisteSchema: Schema = new Schema({
  createdAt: { type: Date, default: Date.now },
  nom: { type: String, required: true },
  typeCourse: { type: String, required: true },
  description: { type: String, required: true },
  vignette: { type: String, required: true },
  nombreFoisJouee: { type: Number, required: true },
  coteAppreciation: { type: Number, required: true },
  meilleursTemps: { type: [], required: true },
  listepositions: { type: [], required: true },
});

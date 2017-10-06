import { Schema } from 'mongoose';

export const pisteSchema: Schema = new Schema({
  createdAt: { type: Date, default: Date.now },
  name: String,
  nom: String,
  typeCourse: String,
  description: String,
  nombreFoisJouee: Number,
  coteAppreciation: Number,
  meilleursTemps: Number,
  listePoints: []
});

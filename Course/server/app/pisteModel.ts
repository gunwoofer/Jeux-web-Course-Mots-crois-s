import { pisteSchema } from './schemaPiste';
import mongoose = require('mongoose');
import { Document, Model } from 'mongoose';
import { Piste as PisteInterface } from './pisteInterface';

export interface PisteModel extends PisteInterface, Document {}

export const modelDePiste = mongoose.model<PisteModel, Model<PisteModel>>('Piste', pisteSchema);

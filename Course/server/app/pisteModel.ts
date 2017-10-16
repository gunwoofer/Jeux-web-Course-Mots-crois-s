import { pisteSchema } from './schemaPiste';
import mongoose = require('mongoose');
import { Document, Model } from 'mongoose';
import { Piste as PisteInterface } from './pisteInterface';

export interface PisteModel extends PisteInterface, Document {}

export interface PisteModelStatic extends Model<PisteModel> {}

export const Piste = mongoose.model<PisteModel, PisteModelStatic>('Piste', pisteSchema);

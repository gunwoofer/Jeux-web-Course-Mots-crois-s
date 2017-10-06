import { Injectable, Component } from '@angular/core';

@Injectable()
export class MessageErreurService {
    public afficherMessageErreurs(nbAnglesPlusPetit45: number, nbSegmentsTropProche: number, nbSegmentsCroises: number): string {
        let message = '';
        if (nbAnglesPlusPetit45 > 0) {
          message += 'Angle(s) inférieurs à 45° => ' + nbAnglesPlusPetit45 + ' ; ';
        }
        if (nbSegmentsTropProche > 0) {
          message += 'Segment(s) trop proche(s) => ' + nbSegmentsTropProche + ' ; ';
        }
        if (nbSegmentsCroises > 0) {
          message += 'Segment(s) croisé(s) => ' + nbSegmentsCroises + ' ; ';
        }
        return message;
      }
}

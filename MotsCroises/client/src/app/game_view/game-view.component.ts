import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";


import 'rxjs/add/operator/switchMap';
import {GameViewService} from "./game-view.service";


@Component({
  selector: 'game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})

export class GameViewComponent implements OnInit {
  public nbJoueurs: string;

  constructor(
    private route: ActivatedRoute,
    private gameViewService: GameViewService
  ) {
    console.log(this.gameViewService.getPartie());
    this.gameViewService.grilleGenere$.subscribe(specificationGrille => {
      console.log(specificationGrille);
    });
  }

  public ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.nbJoueurs = params.get('nbJoueurs'))
      .subscribe();
  }


}

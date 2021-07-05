import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Output() evento = new EventEmitter<string>();
  constructor(
    private menu: MenuController,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.menuClose();
    });
   }

  ngOnInit() {}

  opcion(value: string) {
    this.menuClose();
    this.evento.emit(value);
  }

  menuClose(){
    this.menu.close();
  }

}

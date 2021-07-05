import { Component } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private auth: AuthenticationService
  ) {
    this.refresToken();
  }

  refresToken(){
    setTimeout(() => {
      this.auth.refreshToken();
    }, 420000);
  }

}

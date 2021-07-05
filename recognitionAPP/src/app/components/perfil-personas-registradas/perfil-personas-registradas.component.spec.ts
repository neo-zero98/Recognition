import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PerfilPersonasRegistradasComponent } from './perfil-personas-registradas.component';

describe('PerfilPersonasRegistradasComponent', () => {
  let component: PerfilPersonasRegistradasComponent;
  let fixture: ComponentFixture<PerfilPersonasRegistradasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilPersonasRegistradasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPersonasRegistradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

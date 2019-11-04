import { async } from '@angular/core/testing';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public showSpinner: boolean;
  public showLoginError: boolean;
  public email: string;
  public password: string;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private spinner: LoadingController,
    public alertController: AlertController) { }

  ngOnInit() {
    this.showSpinner = false;
  }

  async login(): Promise<void> {
    const loading = await this.spinner.create({
      message: 'Anmelden ...',
      duration: 2000
    });
    await loading.present();

    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(
      (success: any) => {
        console.log('Login successfull');

        this.router.navigate(['/']);
      }, async (error: any) => {
        console.error('Login error - Invalid credentials');

        this.showLoginError = true;
        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Alert',
          message: 'Invalid credentials',
          buttons: ['OK']
        });

        await alert.present();
      }
    );
  }

}

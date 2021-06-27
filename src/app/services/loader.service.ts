import { Injectable } from '@angular/core';

import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loader: any;
  constructor(private loadingController: LoadingController) {}

  private async presentLoading(message?: string) {
    this.loader = await this.loadingController.create({
      cssClass: 'custom-loader',
      message: message ? message : 'Please wait...',
      // duration: 2000,
    });

    await this.loader.present();

    const { role, data } = await this.loader.onDidDismiss();
    console.log('Loading dismissed!');
  }

  startDataLoader() {
    this.presentLoading().then((e) => {
      return this.loader;
    });
  }

  stopDataLoader() {
    this.loader.dismiss();
  }
}

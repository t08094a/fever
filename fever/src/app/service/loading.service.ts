import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private isLoading = false;

    constructor(public loadingController: LoadingController) { }

    async present(message: string = null, duration: number = null) {
        this.isLoading = true;
        return await this.loadingController.create({
            duration,
            message
        }).then(a => {
            a.present().then(() => {
                console.log('presented');
                if (!this.isLoading) {
                    a.dismiss().then(() => console.log('abort presenting'));
                }
            });
        });
    }

    async dismiss() {
        if (!this.isLoading) {
            return;
        }

        this.isLoading = false;

        return await this.loadingController.dismiss().then(() => console.log('dismissed'));
    }
}

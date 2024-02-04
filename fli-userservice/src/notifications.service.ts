import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

//const serviceAccount = require('C:\\Users\\Diogo\\Documents\\GitHub\\MEI\\1Ano\\2Semestre\\PWA\\TP_PWA\\serviceAccountKey.json');

@Injectable()
export class NotificationsService {
  private firebaseApp: admin.app.App;

  // constructor() {
  //   this.firebaseApp = admin.initializeApp({
  //     credential: admin.credential.cert(serviceAccount),
  //   });
  // }

  // async generateFCMToken(uid: string): Promise<string> {
  //   try {
  //     const registrationToken = await this.getFCMRegistrationToken(uid);
  //     console.log('FCM Registration Token:', registrationToken);
  //     return registrationToken;
  //   } catch (error) {
  //     console.log('Error generating FCM token:', error);
  //     throw error; 
  //   }
  // }

  // private async getFCMRegistrationToken(uid: string): Promise<string> {
  //   const userRecord = await admin.auth().getUser(uid);
  //   const { pushNotificationToken } = userRecord.customClaims;
  //   return pushNotificationToken;
  // }


  // async generateFCMToken(): Promise<string> {
  //   try {
  //     const app = admin.app(); 

  //     const messaging = app.messaging();
  //     const registrationToken = await messaging.getToken();
  //     console.log('FCM registration token:', registrationToken);
  //     return registrationToken;
  //   } catch (error) {
  //     console.log('Error generating FCM registration token:', error);
  //     throw error; // Optional: Rethrow the error to handle it in the caller's context
  //   }
  // }
}







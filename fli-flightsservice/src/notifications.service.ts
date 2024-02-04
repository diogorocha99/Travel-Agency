import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';

//const serviceAccount = require('C:\\Users\\Diogo\\Documents\\GitHub\\MEI\\1Ano\\2Semestre\\PWA\\TP_PWA\\serviceAccountKey.json');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

@Injectable()
export class NotificationsService {
  private readonly firebaseApp: admin.app.App;

  constructor() {
    this.firebaseApp = admin.app();
  }

  async sendNotification(token: string, title: string, body: string, clickAction?: string, data?: admin.messaging.DataMessagePayload) {
    const message: admin.messaging.Message = {
      token,
      notification: {
        title,
        body,
      },
      data,
      webpush: {
        notification: {
          click_action: clickAction,
        },
      },
    };
  
    try {
      const response = await this.firebaseApp.messaging().send(message); 
      console.log('Notification sent successfully:', response);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
import * as admin from 'firebase-admin';
const serviceAccount = require('C:\\Users\\Diogo\\Documents\\GitHub\\MEI\\1Ano\\2Semestre\\PWA\\TP_PWA\\serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firebaseApp = admin.app();
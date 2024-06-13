import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FIREBASE_AUTH } from './firegase-auth.const';

export const FirebaseAuthProvider: Provider = {
  provide: FIREBASE_AUTH,
  useFactory: (configService: ConfigService) => {
    const serviceAccountKeyJson = configService.getOrThrow(
      'GOOGLE_SERVICE_ACCOUNT_KEY_JSON',
    );

    const serviceAccountKey = JSON.parse(serviceAccountKeyJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
    });

    return admin.auth();
  },
  inject: [ConfigService],
};

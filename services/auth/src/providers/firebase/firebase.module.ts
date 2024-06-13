import { Module } from '@nestjs/common';
import { FIREBASE_AUTH } from './firegase-auth.const';
import { FirebaseAuthProvider } from './firebase-auth.provider';

@Module({
  providers: [FirebaseAuthProvider],
  exports: [FIREBASE_AUTH],
})
export class FirebaseModule {}

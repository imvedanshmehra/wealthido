export class BiometricAuthRequestModel {
  enableFaceOrFingerLock: boolean | null | undefined;
  setUpLater?: boolean | null | undefined;
  biometricPublicKey?: string;

  constructor(
    enableFaceOrFingerLock: boolean,
    setUpLater?: boolean,
    biometricPublicKey?: string
  ) {
    this.enableFaceOrFingerLock = enableFaceOrFingerLock;
    if (setUpLater) {
      this.setUpLater = setUpLater;
    }
    if (biometricPublicKey) {
      this.biometricPublicKey = biometricPublicKey;
    }
  }
}

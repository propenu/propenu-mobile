Follow these steps to build an APK for the Android app.


1. Install EAS CLI: "npm install -g eas-cli"
2. Login: "eas login" 
3. create an eas.json file: "eas build:configure"

4. eas.json :{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}

5. Build the APK: "eas build -p android --profile preview"
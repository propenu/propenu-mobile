Follow these steps to build an APK for the Android app.


1. Install EAS CLI: "npm install -g eas-cli"
   note :"for mac permissions : "sudo npm install -g eas-cli" " or "sudo chown -R $(whoami) /usr/local/lib/node_modules "
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
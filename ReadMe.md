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

or


cd android
./gradlew assembleRelease



android aab file creations(keystore setup):{
enter keystore password:  propenu
Re-enter new password: propenu
What is your first and last name?
  propenu solutions
What is the name of your organizational unit?
   real estate
What is the name of your organization?
    Propenu Solutions Private Limited
What is the name of your City or Locality?
    Hyderabad
What is the name of your State or Province?
    Telangana
What is the two-letter country code for this unit?
   +91
Is CN=propenu solutions, OU=real estate, O=Propenu Solutions Private Limited, L=Hyderabad, ST=Telangana, C="+91" correct?
  
}
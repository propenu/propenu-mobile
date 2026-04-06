
Propenu Mobile App

Real estate mobile application for **verified properties & trusted agents**.  
Built with **React Native (Expo Dev Client)**.

Running the Project

How to Run the Project : 
Connect your mobile device using a USB cable.
Enable File Transfer (MTP) and turn on USB Debugging in Developer Options.

Make sure your device is detected: " adb devices. "

Run the project:  "  npx expo run:android  "  // android device
Run the project:  "  npx expo run:ios  "  // ios 


---------------------------------------------------------------------------------------------------------------------------


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

File Path :android/app/build/outputs/apk/release/app-release.apk


---------------------------------------------------------------------------------------------------------------------------


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


---------------------------------------------------------------------------------------------------------------------------


.AAB file:(to upload in playstore) 
Update app version:
versionCode (must be incremented)
versionName (optional but recommended)

cd android
./gradlew bundleRelease


Output File : android/app/build/outputs/bundle/release/app-release.aab

To check SHA : keytool -printcert -jarfile app/build/outputs/bundle/release/app-release.aab

want to release app in play store :
create new .aab (need to change versions) like above and then upload in the play store

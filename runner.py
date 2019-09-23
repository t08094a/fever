https://jpnarowski.com/how-to-publish-an-ionic-android-app-with-docker/
https://hub.docker.com/r/agileek/ionic-framework/

> docker-compose build
> docker-compose run app ionic build android –release

> keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

Sign the apk with Jarsigner.
> docker-compose run app jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name

Now we need to run Zipalign
In this example we’re creating our 2.1.4 release (android-2.1.4-release.apk). In yours, you’ll replace the output at the end with the name of your own release.

> docker-compose run app /opt/android-sdk-linux/build-tools/23.0.2/zipalign -v 4 /myApp/platforms/android/build/outputs/apk/android-release-unsigned.apk /myApp/platforms/android/build/outputs/apk/android-2.1.4-release.apk

There you go! Now you can upload the APK to the Google Play store and start getting downloads.


docker run -ti --rm -p 8100:8100 -p 35729:35729 -v /path/to/your/ionic-project/:/myApp:rw agileek/ionic-framework:1.4.5


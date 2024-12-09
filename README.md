# wordle-pwa
wordle-pwa

how to build apk
run the following: 
./gradlew clean

./gradlew assembleRelease

apksigner sign --ks D:\VSProjects\wordle-pwa\android.keystore --out d:\wordle.apk app\build\outputs\apk\release\app-release-unsigned.apk

zipalign -c -v 4 d:\wordle.apk

apksigner verify --verbose --print-certs d:\wordle.apk
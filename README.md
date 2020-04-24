# JazzOrca

## Summary

JazzOrca is an app made with React Native to listen to YouTube videos. Current features are listed in [releases](https://github.com/ainar/JazzOrca/releases).

## How to build

JazzOrca is a React Native app (not Expo). So you need to follow the guidelines to [set up an environment](https://reactnative.dev/docs/environment-setup) before attempting to build JazzOrca.

**Modules are not well linked for iOS** as I do not have the set up environment for Apple ecosystem. If you can, you can do it for each module with native code in `package.json`.

Otherwise, building for Android is as simple as:
```
yarn
cd android
./gradlew assembleRelease
```

You can run a Metro server to debug the app with:
```
yarn
npx react-native run-android
```
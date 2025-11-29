# Tinder Hyperhire

Tinder-style swiping experience with stacked cards, profile details, haptics, and custom swipe actions built on Expo Router.

## Screenshot

![App screenshot](assets/images/ss.png)

## Stack

- Expo 54.0.25 (React Native 0.81.5, React 19.1.0)
- Expo Router 6.0.15
- React Navigation 7 (native/bottom-tabs/elements)
- Reanimated 4.1.1, Gesture Handler 2.28.0
- MMKV storage, Zustand state

## Prerequisites

- Bun or Node/npm
- Xcode + iOS Simulator for iOS runs
- Android Studio + Android Emulator for Android runs

## Setup

Install dependencies:

```bash
bun install
# or
npm install
```

### iOS

```bash
bunx expo prebuild -p ios
bun ios             # launches the iOS simulator
# or
npx expo prebuild -p ios
npm run ios
```

### Android

```bash
bunx expo prebuild -p android
bun android         # launches the Android emulator
# or
npx expo prebuild -p android
npm run android
```

### Web / dev server (optional)

```bash
bunx expo start
# or
npx expo start
```

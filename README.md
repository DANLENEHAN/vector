# Getting Started

If you have installed everything skip to 'Step 5'

## Step 1: Install Brew

```bash
# fresh install
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# update
brew update
```
## Step 2: Install Node

```bash
# If you need to install node
brew install node

# Check node version
npm n --version

# Install latest node version
npm install n latest
```

## Step 3: IOS installs

Watchman is a tool by Facebook for watching changes in the filesystem. It is highly recommended you install it for better performance.

```bash
brew install watchman
```

Install Xcode via the [Mac App Store.]( https://apps.apple.com/us/app/xcode/id497799835?mt=12) Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

CocoaPods is one of the dependency management system available for iOS. CocoaPods is a Ruby gem. You can install CocoaPods using the version of Ruby that ships with the latest version of macOS.

```bash
# Install drb dependency
sudo gem install drb -v 2.0.5

# Install activesupport dependency
gem install activesupport -v 6.1.7.6

# install cocoapods
sudo gem install cocoapods
```

## Step 4: Android installs

Install the OpenJDK distribution called Azul Zulu using Homebrew.

```bash
brew tap homebrew/cask-versions

brew install --cask zulu11

# Get path to where cask was installed to double-click installer
brew info --cask zulu11
```

After you install the JDK, update your JAVA_HOME environment variable.

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home
```

Download and install [Android Studio.](https://developer.android.com/studio/index.html).

The React Native tools require some environment variables to be set up in order to build apps with native code.

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Step 5: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS



```bash
# cd into ios folder
cd ios
# install pods
pod install

# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Font Awesome
Setup
Install the package via npm:
npm i --save @fortawesome/react-native-fontawesome @fortawesome/fontawesome-svg-core react-native-svg
Move into the ios folder and install the pods:
cd ios && pod install

Add free icon packs to your app: 
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-brands-svg-icons
npm i --save @fortawesome/free-regular-svg-icons

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

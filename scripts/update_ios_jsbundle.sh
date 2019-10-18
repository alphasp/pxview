#!/bin/bash

cd ..

jsbundlePath="./ios/main.jsbundle"
assetsPath="./ios/assets/"

#Check we have all needed programs installed
if ! [ -x "$(command -v node)" ]; then
    echo "Node is missing, installing..."
    brew install node
fi

if ! [ -x "$(command -v watchman)" ]; then
    echo "Watchman is missing, installing..."
    brew install watchman
fi

if ! [ -x "$(command -v react-native)" ]; then
    echo "Restore ownership of the user's npm related folders to the current user..."
    sudo chown -R $USER:$GROUP ~/.npm
    sudo chown -R $USER:$GROUP ~/.config

    echo "React-native CLI is missing, installing..."
    npm install -g react-native-cli
fi

#Remove the old files and folders for iOS
if [ -f $jsbundlePath ]; then
	echo "Removing old file at $jsbundlePath"
	rm -rf $jsbundlePath
else
	echo "No file at $jsbundlePath, continuing"
fi

if [ -d $assetsPath ]; then
	echo "Removing old folder at $assetsPath"
	rm -rf $assetsPath
else
	echo "No folder at $assetsPath, continuing"
fi

#Create the react-native bundle for iOS
echo "Updating main.jsbundle file for iOS..."
react-native bundle --platform ios  --dev false --assets-dest ./ios --entry-file index.js --bundle-output ios/main.jsbundle

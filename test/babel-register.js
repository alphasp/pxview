require("babel-register")({
  presets: [
    "react-native"
  ],
  plugins: [
    "transform-runtime"
  ],
  only: ['src', 'node_modules/?(react-native-keychain)/']
});
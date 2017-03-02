mkdir node_modules/react-native/Libraries/CustomComponents
mkdir node_modules/react-native/Libraries/CustomComponents/Lists
for file in 'FlatList' 'MetroListView' 'SectionList' 'VirtualizedList' 'VirtualizeUtils' 'ViewabilityHelper' 'VirtualizedSectionList'; \
  do curl https://raw.githubusercontent.com/facebook/react-native/master/Libraries/CustomComponents/Lists/${file}.js > node_modules/react-native/Libraries/CustomComponents/Lists/${file}.js; \
  done
  Libraries/CustomComponents/Lists/SectionList.js 
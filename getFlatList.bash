for file in 'FlatList' 'MetroListView' 'VirtualizedList' 'VirtualizeUtils' 'ViewabilityHelper'; \
  do curl https://raw.githubusercontent.com/facebook/react-native/master/Libraries/Experimental/${file}.js > node_modules/react-native/Libraries/Experimental/${file}.js; \
  done
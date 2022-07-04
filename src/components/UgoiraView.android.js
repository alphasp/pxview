import PropTypes from 'prop-types';
import { requireNativeComponent } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

const iface = {
  name: 'UgoiraView',
  propTypes: {
    images: PropTypes.arrayOf(
      PropTypes.shape({
        uri: PropTypes.string.isRequired,
        delay: PropTypes.number.isRequired,
      }),
    ).isRequired,
    paused: PropTypes.bool,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch', 'center']),
    ...ViewPropTypes,
  },
};
const UgoiraView = requireNativeComponent('UgoiraView', iface);

export default UgoiraView;

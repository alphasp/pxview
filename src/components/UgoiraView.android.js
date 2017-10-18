import { PropTypes } from 'react';
import { requireNativeComponent, ViewPropTypes } from 'react-native';

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

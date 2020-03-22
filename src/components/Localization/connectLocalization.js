import React from 'react';
import { LocalizationContext } from './LocalizationProvider';

// todo
// const connectLocalization = WrappedComponent => {
//   class Localization extends Component {
//     render() {
//       const { innerRef } = this.props;
//       const { i18n } = LocalizationContext;
//       return <WrappedComponent {...this.props} i18n={i18n} ref={innerRef} />;
//     }
//   }

//   hoistNonReactStatic(Localization, WrappedComponent);

//   return connect(state => ({
//     lang: state.i18n.lang,
//   }))(Localization);
// };

const connectLocalization = (Comp) => (props) => (
  <LocalizationContext.Consumer>
    {(i18n) => <Comp {...{ ...props, ...i18n }} />}
  </LocalizationContext.Consumer>
);

export default connectLocalization;

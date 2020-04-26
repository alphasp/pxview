import React from 'react';
import useLocalization from './useLocalization';

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

const connectLocalization = (Comp) => (props) => {
  const { i18n, lang } = useLocalization();
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Comp {...props} i18n={i18n} lang={lang} />;
};

export default connectLocalization;

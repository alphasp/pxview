import React, { Component } from 'react';
import { View, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import NovelViewer from '../../components/NovelViewer';
import PXHeader from '../../components/PXHeader';
import HeaderTextTitle from '../../components/HeaderTextTitle';
import HeaderSettingsButton from '../../components/HeaderSettingsButton';
import Loader from '../../components/Loader';
import * as novelTextActionCreators from '../../common/actions/novelText';
import * as modalActionCreators from '../../common/actions/modal';
import { makeGetParsedNovelText } from '../../common/selectors';
import { MODAL_TYPES } from '../../common/constants';
import { globalStyles } from '../../styles';

class NovelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  componentDidMount() {
    const { fetchNovelText, clearNovelText, novelText, novelId } = this.props;
    if (!novelText || !novelText.text) {
      clearNovelText(novelId);
      InteractionManager.runAfterInteractions(() => {
        fetchNovelText(novelId);
      });
    }
  }

  handleOnIndexChange = index => {
    this.setState({ index });
  };

  handleOnPressPageLink = page => {
    this.setState({ index: parseInt(page, 10) - 1 });
  };

  handleOnPressOpenSettings = () => {
    const { openModal } = this.props;
    openModal(MODAL_TYPES.NOVEL_SETTINGS);
  };

  renderHeaderTitle = () => {
    const { parsedNovelText } = this.props;
    const { index } = this.state;
    return (
      <HeaderTextTitle>
        {`${index + 1}/${parsedNovelText.length}`}
      </HeaderTextTitle>
    );
  };

  renderHeaderRight = () =>
    <HeaderSettingsButton onPress={this.handleOnPressOpenSettings} />;

  render() {
    const {
      novelId,
      novelText,
      parsedNovelText,
      novelSettings: { fontSize, lineHeight },
      theme,
    } = this.props;
    const { index } = this.state;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <PXHeader
          darkTheme
          showBackButton
          headerTitle={parsedNovelText && this.renderHeaderTitle()}
          headerRight={this.renderHeaderRight()}
        />
        {(!novelText || (!novelText.loaded || novelText.loading)) && <Loader />}
        {parsedNovelText &&
          <NovelViewer
            novelId={novelId}
            items={parsedNovelText}
            index={index}
            fontSize={fontSize}
            lineHeight={lineHeight}
            onIndexChange={this.handleOnIndexChange}
            onPressPageLink={this.handleOnPressPageLink}
          />}
      </View>
    );
  }
}

export default withTheme(
  connect(
    () => {
      const getParsedNovelText = makeGetParsedNovelText();
      return (state, props) => {
        const { novelText, novelSettings } = state;
        const parsedNovelText = getParsedNovelText(state, props);
        const novelId = props.novelId || props.navigation.state.params.novelId;
        return {
          novelText: novelText[novelId],
          novelId,
          parsedNovelText,
          novelSettings,
        };
      };
    },
    { ...novelTextActionCreators, ...modalActionCreators },
  )(NovelReader),
);

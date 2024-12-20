import React from 'react';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import useAutoScreen from '../context/useAutoScreen';
import {getDarkModePreference} from '../common/darkModePreference';
import {Text} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
const systemFonts = [...defaultSystemFonts, 'Gilroy-Regular'];
const HTMLDisplay = React.memo(function HTMLDisplay({
  html,
  style,
}: {
  html: string;
  style?: any;
}) {
  const autoScreen = useAutoScreen();
  const isDarkMode = getDarkModePreference();

  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );
  return (
      <RenderHtml
        contentWidth={autoScreen / 2}
        source={{html: `<section>${html}</section>`}} // Wrap HTML
        systemFonts={systemFonts}
        tagsStyles={{
          section: {
            fontFamily: 'Gilroy-Bold',
            color: isDarkMode ? '#ffffff' : '#212121',
            textAlign: 'center',
            ...style,
          },
          b: {fontFamily: 'Gilroy-Bold', fontWeight: 'bold'},
          i: {fontFamily: 'Gilroy-Bold', fontStyle: 'italic'},
        }}
      />
  );
});
export default HTMLDisplay;

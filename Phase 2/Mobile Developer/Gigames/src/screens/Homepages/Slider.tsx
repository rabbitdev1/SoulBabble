import React from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
import { getDarkModePreference } from '../../components/common/darkModePreference';
interface SliderProps {
  sliderData: {gambar: string; url?: string}[];
  activeSlide: number;
  setActiveSlide: React.Dispatch<React.SetStateAction<number>>;
  sliderLoading: boolean;
  isWebSetting: any;
}
const styles = StyleSheet.create({
  sliderContainer: {
    flex: 1,
    padding: 5,
    aspectRatio: 2.5 / 1,
  },
  image: {
    borderRadius: 6,
    width: '100%',
    height: '100%',
  },
});
const Slider: React.FC<SliderProps> = ({
  sliderData,
  activeSlide,
  setActiveSlide,
  sliderLoading,
  isWebSetting,
}) => {
  const autoScreen = useAutoScreen();
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
    const isDarkMode = getDarkModePreference();
  

  return (
    <ConditionalRender
      productsData={sliderData}
      isLoading={sliderLoading}
      style={{aspectRatio: 3 / 1, marginHorizontal: 16}}
      parsedSetting={isWebSetting}
      model={'emptyData'}>
      <Carousel
        layout="default"
        autoplayInterval={8000}
        autoplay={true}
        data={sliderData}
        loop={true}
        sliderWidth={autoScreen}
        itemWidth={autoScreen - 20}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        onSnapToItem={index => setActiveSlide(index)}
        renderItem={({item}) => {
          return (
            <View style={styles.sliderContainer}>
              {item.url ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => item.url && Linking.openURL(item.url)}>
                  <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    style={styles.image}
                    source={{uri: item.gambar}}
                  />
                </TouchableOpacity>
              ) : (
                <FastImage
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.image}
                  source={{uri: item.gambar}}
                />
              )}
            </View>
          );
        }}
        removeClippedSubviews={false}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          marginBottom: 6,
        }}>
        <Pagination
          dotsLength={sliderData?.length}
          activeDotIndex={activeSlide}
          dotContainerStyle={{marginHorizontal: -2}}
          containerStyle={{paddingVertical: 4}}
          dotStyle={{
            width: autoScreen / 15,
            height: 5,
            borderRadius: 50,
            backgroundColor:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
          }}
          inactiveDotStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    </ConditionalRender>
  );
};
export default Slider;

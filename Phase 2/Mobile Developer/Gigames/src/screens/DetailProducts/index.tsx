import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modalbox';
import RenderHtml, {
  defaultHTMLElementModels,
  defaultSystemFonts,
  HTMLContentModel,
} from 'react-native-render-html';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {setDropdownAlert} from '../../../store/actions/todoActions';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';
import '../../../utils/ignoreWarnings';
import RollyIcon from '../../assets/icon/ic_rolly.svg';
import DynamicButton from '../../components/common/DynamicButton';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
import InputFormComponent from './InputFormComponent';
import ProductBanner from './ProductBanner';
import ProductReviews from './ProductReviews';
import ProductSelection from './ProductSelection';
import {getDarkModePreference} from '../../components/common/darkModePreference';
const systemFonts = [...defaultSystemFonts, 'Gilroy-Regular'];
type screenProp = StackNavigationProp<RootStackParamList, 'Details'>;
export default function ProductPages() {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const dispatch = useDispatch();
  const navigation = useNavigation<screenProp>();
  const isDarkMode = getDarkModePreference();
  const route = useRoute();
  const {slug, data} = route.params as {slug: string; data?: any};

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;

  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );
  const isProfile = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );

  const [productData, setProductData] = useState<any>([]);
  const [itemProduct, setItemProduct] = useState<any>([]);
  const [reviewData, setReviewData] = useState<any>([]);
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const [rate, setRate] = useState<any>({});

  const [productLoading, setProductLoading] = useState<boolean>(true);
  const [reviewLoading, setReviewLoading] = useState<boolean>(true);
  const [isModalAds, setisModalAds] = useState<boolean>(false);
  const [isBantuan, setIsBantuan] = useState({uri: '', status: false});
  const [isModalDescription, setIsModalDescription] = useState({
    uri: '',
    status: false,
  });

  const [inputForms, setInputForms] = useState<any>([]);
  const [saveID, setSaveID] = useState<any>([]);
  const [selectedNominalItems, setselectedNominalItems] = useState({});

  const [refreshingPage, setrefreshingPage] = useState(false);
  const autoScreen = useAutoScreen();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchDataApi();
    });
    return () => {
      unsubscribe();
    };
  }, [slug]);
  useEffect(() => {
    if (data) {
      setselectedNominalItems(data);
    } else {
      setselectedNominalItems({});
    }
  }, [data]);
  const customHTMLElementModels = {
    span: defaultHTMLElementModels.span.extend({
      contentModel: HTMLContentModel.block,
    }),
  };

  const fetchDataApi = async () => {
    if (isLogin) {
      fetchDataProduct(isLogin?.apiKey, isLogin?.token, slug);
    } else {
      fetchDataProduct('', '', slug);
    }
  };

  const fetchDataProduct = async (api_key: any, token: any, slug: any) => {
    setProductLoading(true);
    try {
      const formattedPath = slug.replace('/beli/', '');
      const params = new URLSearchParams();
      api_key !== '' && params.append('api_key', api_key);
      params.append('slug', formattedPath);

      const response = await apiClient({
        baseurl: 'user/produk',
        method: 'POST',
        XGORDON: 'PRODUK',
        body: params,
        apiKey: api_key,
        token: token,
      });
      setProductLoading(false);
      if (response?.statusCode === 200) {
        setProductData(response.result.data);
        setItemProduct(response.result.data?.produk || []);
        setInputForms(response.result.data?.form || []);

        const transformedData = response.result.data?.saveId?.map(
          (item: any) => ({
            text: item.nama,
            value: JSON.stringify({
              id: item.id,
              more_id: item.more_id,
              another_id: item.another_id,
              other_id: item.other_id,
            }),
          }),
        );
        setSaveID(transformedData || []);
        fetchDataReview(response.result.data?.id);
        response.result?.data?.status_popup === '1' && setisModalAds(true);
        setIsBantuan({uri: response.result?.data?.bantuan, status: false});
      } else {
        setItemProduct([]);
        setProductData([]);
        setInputForms([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchDataReview = async (id: any) => {
    setReviewLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/listReview',
        parameter: `idKategori=${id}&limit=10&page=0`,
        method: 'GET',
        XGORDON: 'LISTREVIEW',
      });
      setReviewLoading(false);
      if (response?.statusCode === 200) {
        setReviewData(response.result.data);
        setRate(response.result.rate);
      } else {
        setReviewData([]);
        setRate([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleRefresh = () => {
    refreshControl(setrefreshingPage, fetchDataApi);
  };

  const HeaderAnimation = () => {
    const margin = scrollYAnimatedValue.interpolate({
      inputRange: [20, 100],
      outputRange: [-90, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          marginTop: margin,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#32323E',
          elevation: 1,
        }}>
        <TopBar
          isIconLeft={false}
          isShowLogo={false}
          title={productData?.nama}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? colorSystem.dark.background
          : colorSystem.light.background,
      }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={
          isDarkMode ? colorSystem.dark.card : colorSystem.light.card
        }
        translucent={false}
        networkActivityIndicatorVisible={true}
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshingPage}
            onRefresh={handleRefresh}
          />
        }
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollYAnimatedValue}}}],
          {useNativeDriver: false},
        )}>
        <TopBar
          isIconLeft={false}
          isShowLogo={true}
          title={productData?.nama}
        />
        <View
          style={{flex: 1, flexDirection: 'column', gap: 16, marginBottom: 50}}>
          <ProductBanner productData={productData} type={1} title={''} />
          {reviewData.length > 0 && (
            <ProductReviews
              rate={rate}
              isWebSetting={isWebSetting}
              reviewLoading={reviewLoading}
              reviewData={reviewData}
              navigation={navigation}
              productData={productData}
              isDarkMode={isDarkMode}
            />
          )}
          <ConditionalRender
            productsData={itemProduct}
            isLoading={productLoading}
            parsedSetting={isWebSetting}
            model={'emptyItem'}>
            <InputFormComponent
              inputForms={inputForms}
              saveID={saveID}
              isLogin={isLogin}
              navigation={navigation}
              setInputForms={setInputForms}
              productData={productData}
              isBantuan={isBantuan}
              setIsBantuan={setIsBantuan}
              isModalDescription={isModalDescription}
              setIsModalDescription={setIsModalDescription}
            />
            <ProductSelection
              itemProduct={itemProduct}
              parsedProfile={isProfile}
              selectedNominalItems={selectedNominalItems}
              setselectedNominalItems={setselectedNominalItems}
            />
          </ConditionalRender>
        </View>
      </ScrollView>
      {itemProduct?.length !== 0 &&
        Object.keys(selectedNominalItems).length !== 0 && (
          <View
            style={{
              flexDirection: 'column',
              padding: 16,
              elevation: 1,
              backgroundColor: isDarkMode
                ? colorSystem.dark.background
                : colorSystem.light.background,
              borderTopWidth: 1,
              borderTopColor: isDarkMode
                ? colorSystem.dark.bordercolor
                : colorSystem.light.bordercolor,
            }}>
            <DynamicButton
              initialValue="Lanjutkan Pembayaran"
              iconLeft={
                <RollyIcon
                  width={18}
                  style={{
                    aspectRatio: 1,
                    color:
                      Object.keys(selectedNominalItems).length === 0
                        ? '#818994'
                        : '#ffffff',
                  }}
                />
              }
              styleSelected={{
                backgroundColor:
                  Object.keys(selectedNominalItems).length === 0
                    ? isDarkMode
                      ? undefined
                      : '#F7F8FC'
                    : isDarkMode
                    ? colorSystem.dark.secondary
                    : colorSystem.light.secondary,
                borderWidth:
                  Object.keys(selectedNominalItems).length === 0 ? 1 : 0,
              }}
              colorText={
                Object.keys(selectedNominalItems).length === 0
                  ? 'undefined'
                  : '#ffffff'
              }
              onPress={() => {
                const isFormValid: boolean = inputForms.every(
                  (item: any) => item.value && item.value.trim() !== '',
                );

                if (isFormValid) {
                  navigation.navigate('NextStep', {
                    slug: slug,
                    selectedNominalItems: selectedNominalItems,
                    inputForms: inputForms,
                  });
                } else {
                  inputForms.forEach((item: any) => {
                    if (!item.value || item.value.trim() === '') {
                      dispatch(
                        dispatch(
                          setDropdownAlert(
                            'error',
                            'Error',
                            `Value for ${item.title} is missing or empty`,
                          ),
                        ),
                      );
                    }
                  });
                }
              }}
            />
          </View>
        )}
      <HeaderAnimation />

      <Modal
        animationDuration={1000}
        swipeToClose={false}
        backdropOpacity={0.5}
        backdropPressToClose={false}
        style={{
          width: autoScreen - 32,
          height: 'auto',
          elevation: 1,
          backgroundColor: isDarkMode
            ? colorSystem.dark.background
            : colorSystem.light.background,
          borderRadius: 8,
          gap: 8,
          padding: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        isOpen={isModalDescription?.status}>
        <ScrollView>
          <RenderHtml
            contentWidth={autoScreen / 2}
            // baseStyle={{backgroundColor:'red'}}
            customHTMLElementModels={customHTMLElementModels}
            systemFonts={systemFonts}
            tagsStyles={{
              b: {
                fontFamily: 'Gilroy-Bold',
                color: isDarkMode ? '#fff' : '#000',
              },
              a: {
                fontFamily: 'Gilroy-Regular',
                color: isDarkMode ? '#fff' : '#000',
              },
            }}
            source={{html: '<a>' + productData.tutorial_singkat + '</a>'}}
          />
        </ScrollView>
        <DynamicButton
          initialValue="Kembali"
          onPress={() => {
            setIsModalDescription({...isModalDescription, status: false});
          }}
        />
      </Modal>
      <Modal
        animationDuration={1000}
        swipeToClose={false}
        backdropOpacity={0.5}
        backdropPressToClose={false}
        style={{
          width: autoScreen - 32,
          height: 'auto',
          elevation: 1,
          backgroundColor: isDarkMode
            ? colorSystem.dark.background
            : colorSystem.light.background,
          borderRadius: 8,
          padding: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        isOpen={isBantuan?.status}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={{width: '100%', aspectRatio: 2}}
          source={{uri: isBantuan?.uri}}
        />
        <DynamicButton
          initialValue="Kembali"
          onPress={() => {
            setIsBantuan({...isBantuan, status: false});
          }}
        />
      </Modal>
      <Modal
        animationDuration={1000}
        swipeToClose={true}
        backdropOpacity={0.5}
        backdropPressToClose={true}
        style={{
          width: autoScreen - 32,
          height: 'auto',
          elevation: 1,
          backgroundColor: isDarkMode
            ? colorSystem.dark.background
            : colorSystem.light.background,
          borderRadius: 8,
          padding: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        isOpen={isModalAds}>
        <ScrollView>
          <RenderHtml
            contentWidth={autoScreen / 2}
            customHTMLElementModels={customHTMLElementModels}
            systemFonts={systemFonts}
            tagsStyles={{
              b: {
                fontFamily: 'Gilroy-Bold',
                color: isDarkMode ? '#fff' : '#000',
              },
              a: {
                fontFamily: 'Gilroy-Regular',
                color: isDarkMode ? '#fff' : '#000',
              },
            }}
            source={{html: '<a>' + productData.popup + '</a>'}}
          />
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
}

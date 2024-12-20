import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../../../App';
import {RootState} from '../../../store/reducers';
import {apiClient} from '../../../utils/api/apiClient';

import Modal from 'react-native-modalbox';
import '../../../utils/ignoreWarnings';
import {getDarkModePreference} from '../../components/common/darkModePreference';
import DynamicButton from '../../components/common/DynamicButton';
import DynamicText from '../../components/common/DynamicText';
import Input from '../../components/common/Input';
import {refreshControl} from '../../components/context/refreshFunctions';
import useAutoScreen from '../../components/context/useAutoScreen';
import ConditionalRender from '../../components/ui/ConditionalRender';
import TopBar from '../../components/ui/TopBar';
import {isPending, setDropdownAlert} from '../../../store/actions/todoActions';
import Trash_btn from '../../assets/icon/ic_trash.svg';
import Pencil_btn from '../../assets/icon/ic_pencil.svg';

interface SaveIDPagesProps {}
type SaveIDPagesScreenProp = StackNavigationProp<
  RootStackParamList,
  'DrawerScreen'
>;
const SaveIDPages: React.FC<SaveIDPagesProps> = () => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const navigation = useNavigation<SaveIDPagesScreenProp>();
  const autoScreen = useAutoScreen();
  const dispatch = useDispatch();

  const [SaveIDData, setSaveIDData] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [SaveIDLoading, setSaveIDLoading] = useState(true);
  const [productLoading, setProductLoading] = useState<boolean>(true);

  const [valuesaveID, setValue] = useState<any>({});
  const [inputForms, setInputForms] = useState<any>([]);
  const [inputValue, setInputValue] = useState<any>('');

  const scrollYAnimatedValue = useRef(new Animated.Value(0)).current;
  const isProfile = useSelector(
    (state: RootState) => state.todoReducer.isProfile,
  );
  const isLogin = useSelector((state: RootState) => state.todoReducer.isLogin);
  const isWebSetting = useSelector(
    (state: RootState) => state.todoReducer.isWebSetting,
  );

  const isDarkMode = getDarkModePreference();
  const [isModalAdd, setIsModalAdd] = useState({
    status: false,
    isEdit: false,
  });
  const [refreshingPage, setrefreshingPage] = useState<boolean>(false);

  useEffect(() => {
    fetchDataApi();
  }, []);

  const fetchDataApi = async () => {
    fetchDataProduct();
    if (isLogin) {
      fetchSaveID(isLogin?.apiKey, isLogin?.token);
    }
  };

  const fetchDataProduct = async () => {
    setProductLoading(true);
    try {
      const response = await apiClient({
        baseurl: 'user/kategori',
        method: 'GET',
        XGORDON: 'KATEGORI',
      });
      setProductLoading(false);
      if (response?.statusCode === 200) {
        const allCategory = response?.result.data.reduce(
          (accumulator: any, current: any) => {
            return [...accumulator, ...current.kategori];
          },
          [],
        );
        const listProduct = allCategory.map((item: any) => {
          return {
            ...item,
            jenis: response?.result.data.find((jenis: any) =>
              jenis.kategori.some(
                (kategori: any) => kategori.nama === item.nama,
              ),
            ).jenis,
          };
        });
        const transformedData = listProduct.map((game: any) => ({
          text: game.nama,
          value: JSON.stringify([game.slug, game.id_kategori]),
        }));

        setListProduct(transformedData);
        fetchDetailProduct(transformedData[0].value[0]);
      } else {
        setListProduct([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchDetailProduct = async (slug: any) => {
    setProductLoading(true);
    try {
      const formattedPath = slug.replace('/beli/', '');
      const params = new URLSearchParams();
      params.append('slug', formattedPath);

      const response = await apiClient({
        baseurl: 'user/produk',
        method: 'POST',
        XGORDON: 'PRODUK',
        body: params,
      });
      setProductLoading(false);
      if (response?.statusCode === 200) {
        setInputForms(response.result.data?.form || []);
      } else {
        setInputForms([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSaveID = async (api_key: any, token: any) => {
    setSaveIDLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);

      const response = await apiClient({
        baseurl: 'user/usergame?list',
        method: 'POST',
        XGORDON: 'USERGAME',
        apiKey: api_key,
        token: token,
        body: params,
      });
      setSaveIDLoading(false);
      if (response?.statusCode === 200) {
        setSaveIDData(response?.result?.data);
      } else {
        setSaveIDData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchAddSaveID = async (api_key: any, token: any, data: any) => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          params.append(key, data[key]);
        }
      }

      const response = await apiClient({
        baseurl: 'user/usergame?add',
        method: 'POST',
        XGORDON: 'USERGAME',
        apiKey: api_key,
        token: token,
        body: params,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        dispatch(setDropdownAlert('success', 'Berhasil', response?.result.msg));
        setIsModalAdd({...isModalAdd, status: false, isEdit: false});
        setInputForms([]);
        setInputValue('');
        setValue('');
        fetchSaveID(isLogin?.apiKey, isLogin?.token);
      } else {
        dispatch(setDropdownAlert('error', 'Gagal', response?.result.msg));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchEditSaveID = async (api_key: any, token: any, data: any) => {
    dispatch(isPending(true));
    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);
      for (const key in data) {
        if (key === 'id_list') {
          params.append('id', data[key]);
        }
        if (Object.hasOwnProperty.call(data, key)) {
          params.append(key, data[key]);
        }
      }

      const response = await apiClient({
        baseurl: 'user/usergame?edit',
        method: 'POST',
        XGORDON: 'USERGAME',
        apiKey: api_key,
        token: token,
        body: params,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        dispatch(setDropdownAlert('success', 'Berhasil', response?.result.msg));
        setIsModalAdd({...isModalAdd, status: false, isEdit: false});
        setInputForms([]);
        setInputValue('');
        setValue('');
        fetchSaveID(isLogin?.apiKey, isLogin?.token);
      } else {
        dispatch(setDropdownAlert('error', 'Gagal', response?.result.msg));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchDeleteSaveID = async (api_key: any, token: any, id: any) => {
    dispatch(isPending(true));

    try {
      const params = new URLSearchParams();
      params.append('api_key', api_key);
      params.append('id', id);

      const response = await apiClient({
        baseurl: 'user/usergame?delete',
        method: 'POST',
        XGORDON: 'USERGAME',
        apiKey: api_key,
        token: token,
        body: params,
      });
      dispatch(isPending(false));
      if (response?.statusCode === 200) {
        dispatch(setDropdownAlert('success', 'Berhasil', response?.result.msg));
        setInputForms([]);
        setInputValue('');
        setValue('');
        fetchSaveID(isLogin?.apiKey, isLogin?.token);
      } else {
        dispatch(setDropdownAlert('error', 'Gagal', response?.result.msg));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (index: number, value: any) => {
    const newInputForms = [...inputForms];
    newInputForms[index].value = value;
    setInputForms(newInputForms);
  };

  const SaveIDItem = React.memo(({item}: {item: any}) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 8,
          marginHorizontal: 16,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
        <ImageBackground
          style={{
            width: '100%',
            flexDirection: 'row',
            gap: 8,
            position: 'relative',
          }}
          source={{uri: item.background}}
          imageStyle={{
            resizeMode: 'cover',
            alignSelf: 'center',
          }}>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.2,
              backgroundColor: '#212121',
            }}
          />
          <View style={{flex: 1, flexDirection: 'row', padding: 16, gap: 8}}>
            <FastImage
              source={{uri: item.gambar}}
              resizeMode={FastImage.resizeMode.cover}
              style={{
                width: 60,
                borderRadius: 4,
                aspectRatio: 1 / 1,
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <DynamicText size={14} semiBold style={{color: '#ffffff'}}>
                {item.nama}
              </DynamicText>
              <DynamicText
                size={12}
                style={{color: '#ffffff'}}
                numberOfLines={3}>
                {item.id_game && `ID: ${item.id_game}`}{' '}
                {item.other_id && `Other ID: ${item.other_id}`}{' '}
                {item.more_id && `More ID: ${item.more_id}`}{' '}
                {item.another_id && ` Another ID: ${item.another_id}`}{' '}
              </DynamicText>
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              gap: 8,
            }}>
            <TouchableOpacity
              onPress={() =>
                fetchDeleteSaveID(isLogin?.apiKey, isLogin?.token, item.id)
              }
              activeOpacity={0.7}
              style={{
                borderRadius: 30,
                padding: 6,
                aspectRatio: 1,
                backgroundColor: '#ff4661',
              }}>
              <Trash_btn width={16} height={16} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsModalAdd({...isModalAdd, status: true, isEdit: true});
                setValue({
                  nama: item.nama,
                  id_list: item.id,
                  id_kategori: item.id_kategori,
                });
                setInputForms(item.form || []);
              }}
              activeOpacity={0.7}
              style={{
                borderRadius: 30,
                padding: 6,
                aspectRatio: 1,
                backgroundColor: '#707feb',
              }}>
              <Pencil_btn width={16} height={16} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  });
  const handleRefresh = () => {
    refreshControl(setrefreshingPage, fetchDataApi);
  };

  const logIfEmpty = (obj: any) => {
    const keysToCheck = ['id_game', 'nama'];
    let hasEmptyFields = false;

    keysToCheck.forEach(key => {
      if (!obj[key]) {
        dispatch(
          setDropdownAlert('error', 'Gagal', `${key} is empty or undefined`),
        );
        hasEmptyFields = true;
      }
    });

    return hasEmptyFields;
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
      <View style={{flex: 1, flexDirection: 'column'}}>
        <TopBar isIconLeft={false} isShowLogo={false} title={'Save ID'} />
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
          <View style={{gap: 16, flexDirection: 'column', paddingTop: 16}}>
            <View style={{flexDirection: 'column', gap: 8}}>
              <ConditionalRender
                productsData={SaveIDData}
                isLoading={SaveIDLoading}
                style={{aspectRatio: 1 / 1, marginHorizontal: 16}}
                model={'emptyData'}
                parsedSetting={isWebSetting}>
                {SaveIDData.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <SaveIDItem item={item} />
                    </React.Fragment>
                  );
                })}
              </ConditionalRender>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingTop: 16,
            gap: 8,
          }}>
          <DynamicButton
            initialValue={`Tambah`}
            styleSelected={{
              backgroundColor: isDarkMode
                ? colorSystem.dark.secondary
                : colorSystem.light.secondary,
              flex: 1,
              borderWidth: 0,
              marginBottom: 16,
            }}
            colorText={'#ffffff'}
            onPress={() => {
              setValue({...valuesaveID, id_kategori: '1', nama: ''});
              setIsModalAdd({...isModalAdd, status: true, isEdit: false});
              setInputForms([]);
              setInputValue('');
              setValue('');
            }}
          />
        </View>
      </View>

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
        }}
        isOpen={isModalAdd?.status}>
        <View style={{flexDirection: 'column'}}>
          <View
            style={{
              flexDirection: 'column',
              padding: 16,
              paddingBottom: 0,
              gap: 16,
            }}>
            <DynamicText size={14} bold>
              Tambah Game
            </DynamicText>
            <View style={{flexDirection: 'column', gap: 8}}>
              <Input
                label={'Nama'}
                colorText={isDarkMode ? '#ffffff' : '#000000'}
                value={valuesaveID.nama}
                onChange={value => {
                  setValue({
                    ...valuesaveID,
                    nama: value,
                  });
                }}
                type={'default'}
                placeholder={`Masukan Nama Save ID`}
              />
              {isModalAdd.isEdit === false && (
                <Input
                  label={'Produk'}
                  colorText={isDarkMode ? '#ffffff' : '#000000'}
                  value={inputValue}
                  onChange={value => {
                    let parsed = JSON.parse(value);
                    setInputValue(value);
                    fetchDetailProduct(parsed[0]);
                    setValue({
                      ...valuesaveID,
                      id_kategori: parsed[1],
                      slug: parsed[0],
                    });
                  }}
                  type={'select'}
                  options={JSON.stringify(listProduct)}
                  placeholder={`Pilih Produk`}
                />
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 8,
            }}>
            {inputForms.map((item: any, index: any) => {
              return (
                <View
                  key={index}
                  style={[
                    {
                      flexDirection: 'column',
                      width:
                        inputForms.length <= 1
                          ? autoScreen - 65
                          : autoScreen / 2 - 36,
                    },
                    index % 2 === 2
                      ? {marginRight: 8, marginTop: 8}
                      : {marginLeft: 8, marginBottom: 8},
                  ]}>
                  <Input
                    key={index}
                    label={item.title}
                    colorText={isDarkMode ? '#ffffff' : '#000000'}
                    value={item.value === undefined ? '' : item.value}
                    onChange={value => {
                      const inputValue = value;
                      if (inputValue.length <= 500) {
                        handleInputChange(index, inputValue);
                      }
                    }}
                    type={
                      item.type === 'text'
                        ? 'default'
                        : item.type === 'number'
                        ? 'number-pad'
                        : item.type
                    }
                    options={item.options ? item.options : null}
                    placeholder={`${item.placeholder}`}
                  />
                </View>
              );
            })}
          </View>
        </View>
        <View
          style={{flexDirection: 'row', gap: 8, padding: 16, paddingTop: 0}}>
          <DynamicButton
            initialValue="Kembali"
            styleSelected={{
              flex: 1,
            }}
            onPress={() => {
              setIsModalAdd({...isModalAdd, status: false, isEdit: false});
              setInputForms([]);
              setInputValue('');
              setValue('');
            }}
          />
          <DynamicButton
            initialValue="Simpan"
            styleSelected={{
              flex: 1,
              backgroundColor: isDarkMode
                ? colorSystem.dark.secondary
                : colorSystem.light.secondary,
              borderWidth: 0,
            }}
            colorText={'#ffffff'}
            onPress={() => {
              const transformedData = inputForms.reduce(
                (acc: any, item: any) => {
                  acc[item.name] = item.value;
                  return acc;
                },
                {},
              );
              if (isModalAdd.isEdit === true) {
                const updatedObject = {
                  id_game: transformedData.id,
                  ...transformedData,
                };
                const mergedObject = {...updatedObject, ...valuesaveID};

                const hasEmptyFields = logIfEmpty(mergedObject);
                if (!hasEmptyFields) {
                  fetchEditSaveID(
                    isLogin?.apiKey,
                    isLogin?.token,
                    mergedObject,
                  );
                  console.log(mergedObject);
                }
              } else {
                const mergedObject = {...transformedData, ...valuesaveID};
                const updatedObject = {
                  id_game: mergedObject.id,
                  ...mergedObject,
                };
                delete updatedObject.id;
                const hasEmptyFields = logIfEmpty(updatedObject);
                if (!hasEmptyFields) {
                  fetchAddSaveID(
                    isLogin?.apiKey,
                    isLogin?.token,
                    updatedObject,
                  );
                  console.log(updatedObject);
                }
              }
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default SaveIDPages;

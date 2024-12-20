import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modalbox';
import Close_btn from '../../../src/assets/icon/ic_close.svg';
import DynamicText from '../../components/common/DynamicText';
import useAutoScreen from '../../components/context/useAutoScreen';
import HTMLDisplay from '../../components/ui/HTMLDisplay';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
interface FaqModalProps {
  isOpen: boolean;
  setIsModalFaqPembayaran: (isOpen: boolean) => void;
  detailInvoice: any;
  isDarkMode: boolean;
}
const FaqModal = ({
  isOpen,
  setIsModalFaqPembayaran,
  detailInvoice,
  isDarkMode,
}: FaqModalProps) => {
  const colorSystem = useSelector(
      (state: RootState) => state.todoReducer.colorSystem,
    );
  
  const autoScreen = useAutoScreen();
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index: any) => {
    if (activeIndex === index) {
      setActiveIndex(0);
    } else {
      setActiveIndex(index);
    }
  };
  return (
    <Modal
      animationDuration={1000}
      swipeToClose={false}
      backdropOpacity={0.5}
      backdropPressToClose={false}
      style={{
        width: autoScreen,
        height: 'auto',
        elevation: 1,
        backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
        padding: 16,
        justifyContent: 'center',
      }}
      isOpen={isOpen}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <DynamicText size={14} bold>
            FAQ Pembayaran
          </DynamicText>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsModalFaqPembayaran(false)}>
            <Close_btn
              style={{color: isDarkMode ? '#ffffff' : '#212121'}}
              width={22}
              height={22}
            />
          </TouchableOpacity>
        </View>
        {detailInvoice?.faq?.map((item: any, index: number) => {
          return (
            <View key={index} style={{marginBottom: 5}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleAccordion(index)}
                style={{
                  flexDirection: 'row',
                  padding: 15,
                  backgroundColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  borderBottomLeftRadius: activeIndex !== index ? 8 : 0,
                  borderBottomRightRadius: activeIndex !== index ? 8 : 0,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 48,
                    width: 48,
                    borderRadius: 24,
                    backgroundColor: '#ffbc02',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}>
                  <DynamicText bold size={16}>
                    {index + 1}
                  </DynamicText>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <HTMLDisplay html={item.pertanyaan || '<p></p>'} />
                </View>
              </TouchableOpacity>
              {activeIndex === index && (
                <View
                  style={{
                    backgroundColor: isDarkMode
              ? colorSystem.dark.background
              : colorSystem.light.background,
                    borderWidth: 2,
                    borderColor:  isDarkMode
              ? colorSystem.dark.card
              : colorSystem.light.card,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}>
                  <HTMLDisplay html={item.jawaban || '<p></p>'} />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </Modal>
  );
};
export default FaqModal;

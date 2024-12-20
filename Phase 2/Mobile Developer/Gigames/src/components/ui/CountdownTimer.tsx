import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import DynamicText from '../common/DynamicText';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducers';
interface CountdownTimerProps {
  expired: any;
  startTime?: string;
  onResponse: (time: string) => void;
  type: number;
}
const CountdownTimer: React.FC<CountdownTimerProps> = ({
  expired,
  onResponse,
  type,
  startTime,
}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );
  const isDarkMode = useSelector(
    (state: RootState) => state.todoReducer.darkMode,
  );
  const endTime = new Date(expired);
  let initialRemainingTime =
    endTime.getTime() - new Date(startTime || Date.now()).getTime();

  const formatTime = (time: number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return {days, hours, minutes, seconds};
  };

  const [remainingTime, setRemainingTime] = useState(
    formatTime(initialRemainingTime),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      initialRemainingTime -= 1000;
      const newTime = formatTime(initialRemainingTime);
      setRemainingTime(newTime);

      onResponse(
        `${String(newTime.hours).padStart(2, '0')}:${String(
          newTime.minutes,
        ).padStart(2, '0')}:${String(newTime.seconds).padStart(2, '0')}`,
      );

      if (initialRemainingTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onResponse]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {type === 1 ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            padding: 8,
            borderRadius: 6,
            backgroundColor: colorSystem.dark.secondary
          }}>
          <DynamicText style={{color: '#ffffff'}} size={14} bold>
            Bayar Sebelum : {String(remainingTime.hours).padStart(2, '0')}:
            {String(remainingTime.minutes).padStart(2, '0')}:
            {String(remainingTime.seconds).padStart(2, '0')}
          </DynamicText>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            gap: 4,
          }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              backgroundColor: isDarkMode
                ? colorSystem.dark.secondary
                : colorSystem.light.secondary,
            }}>
            <DynamicText style={{color: '#ffffff'}} size={14} bold>
              {String(remainingTime.days).padStart(2, '0')}
            </DynamicText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              backgroundColor: isDarkMode
                ? colorSystem.dark.secondary
                : colorSystem.light.secondary,
            }}>
            <DynamicText style={{color: '#ffffff'}} size={14} bold>
              {String(remainingTime.hours).padStart(2, '0')}
            </DynamicText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              backgroundColor: isDarkMode
                ? colorSystem.dark.secondary
                : colorSystem.light.secondary,
            }}>
            <DynamicText style={{color: '#ffffff'}} size={14} bold>
              {String(remainingTime.minutes).padStart(2, '0')}
            </DynamicText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              backgroundColor: isDarkMode
                ? colorSystem.dark.secondary
                : colorSystem.light.secondary,
            }}>
            <DynamicText style={{color: '#ffffff'}} size={14} bold>
              {String(remainingTime.seconds).padStart(2, '0')}
            </DynamicText>
          </View>
        </View>
      )}
    </View>
  );
};
export default CountdownTimer;

import moment from 'moment';
import React, {useState} from 'react';
import {useColorScheme, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import DynamicText from '../common/DynamicText';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useAutoScreen from '../context/useAutoScreen';
import Modal from 'react-native-modalbox';
import { getDarkModePreference } from '../common/darkModePreference';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';

interface CalendarComponentProps {
  startDate: any;
  endDate: any;
  value: any;
  onDayPress: any;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  startDate,
  endDate,
  value,
  onDayPress,
}) => {
  const colorSystem = useSelector(
    (state: RootState) => state.todoReducer.colorSystem,
  );

  const autoScreen = useAutoScreen();
  const isDarkMode = getDarkModePreference();
  const markedDates: any = {};
  const startDateParse = moment(startDate);
  const endDateParse = moment(endDate);
  const currentDate = startDateParse.clone();
  const [isModalCalendar, setModalCalendar] = useState(false);

  while (currentDate.isSameOrBefore(endDateParse)) {
    const dateKey = currentDate.format('YYYY-MM-DD');
    if (currentDate.isSame(startDateParse, 'day')) {
      markedDates[dateKey] = {
        startingDay: true,
        color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
        textColor: '#ffffff',
      };
    } else if (currentDate.isSame(endDateParse, 'day')) {
      markedDates[dateKey] = {
        endingDay: true,
        selected: true,
        color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
        textColor: '#ffffff',
      };
    } else {
      markedDates[dateKey] = {
        color:  isDarkMode
              ? colorSystem.dark.primary
              : colorSystem.light.primary,
        textColor: '#ffffff',
      };
    }
    currentDate.add(1, 'days');
  }

  return (
    <View style={{flexDirection: 'column', gap: 8, flex: 1}}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setModalCalendar(true);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor:  isDarkMode
          ? colorSystem.dark.background
          : colorSystem.light.background,
          padding: 12,
          gap: 8,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: isDarkMode
                    ? colorSystem.dark.bordercolor
                    : colorSystem.light.bordercolor,
        }}>
        <DynamicText size={12}>{startDate + ' s/d ' + endDate}</DynamicText>
      </TouchableOpacity>
      {isModalCalendar && (
        <Calendar
          style={{width: autoScreen - 32}}
          markedDates={markedDates}
          markingType={'period'}
          onDayPress={day => {
            setModalCalendar(false)
            onDayPress({...value, startDate: day.dateString});
          }}
        />
      )}
    </View>
  );
};

export default CalendarComponent;

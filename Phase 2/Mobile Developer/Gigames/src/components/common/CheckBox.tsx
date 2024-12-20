import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import CheckboxIcon from '../../assets/icon/ic_check_box.svg';
import CheckboxUncheckedIcon from '../../assets/icon/ic_check_box_outline_blank.svg';
import DynamicText from './DynamicText';
function CheckBox({
  label,
  onChange,
  style,
}: {
  label: string;
  onChange: (event: any) => void;
  style: any;
}) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
      <TouchableOpacity onPress={handleCheckboxChange}>
        {isChecked ? (
          <CheckboxIcon width={18} height={18} />
        ) : (
          <CheckboxUncheckedIcon width={18} height={18} />
        )}
      </TouchableOpacity>
      <DynamicText size={12} style={{...style}}>
        {label}
      </DynamicText>
    </View>
  );
}
export default CheckBox;

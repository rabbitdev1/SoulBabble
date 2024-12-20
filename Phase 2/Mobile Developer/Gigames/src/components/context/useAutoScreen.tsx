import {useEffect, useState} from 'react';
import {Dimensions, ScaledSize} from 'react-native';
export default function useAutoScreen(): number {
  const [autoScreen, setAutoScreen] = useState<number>(
    Dimensions.get('window').width,
  );

  useEffect(() => {
    const updateScreenWidth = ({
      window,
    }: {
      window: ScaledSize;
      screen: ScaledSize;
    }) => {
      setAutoScreen(window.width);
    };

    // Dimensions.addEventListener('change', updateScreenWidth);

    return () => {
      // Dimensions.removeEventListener('change', updateScreenWidth);
    };
  }, []);

  return autoScreen;
}

// shareFunctions.ts
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {generateRandomString} from '../../../utils/GenerateRandomString';

export const onShare = async (
  ref: any,
  dispatch: any,
  setDropdownAlert: any,
) => {
  try {
    const randomString = generateRandomString(20);
    const uri = await ref.current.capture();
    const dirs = RNFS.DownloadDirectoryPath;
    const filePath = `${dirs}/${randomString}.png`;
    await RNFS.copyFile(uri, filePath);
    dispatch(
      setDropdownAlert(
        'success',
        'Sukses',
        'Gambar berhasil diunduh, silahkan lihat Galeri',
      ),
    );
    setTimeout(() => {
      shareImage(filePath);
    }, 1000);
  } catch (error) {
    console.error(error);
  }
};

export const shareImage = (filePath: any) => {
  const shareOptions = {
    type: 'image/png',
    url: 'file://' + filePath,
  };

  Share.open(shareOptions)
    .then(res => {})
    .catch(error => {
      console.error(error);
    });
};

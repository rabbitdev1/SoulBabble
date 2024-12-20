export const refreshControl = (
  setrefreshingPage: React.Dispatch<React.SetStateAction<boolean>>,
  fetchDataFunction: () => Promise<void>,
): void => {
  setrefreshingPage(true);
  setTimeout(() => {
    fetchDataFunction().then(() => {
      setrefreshingPage(false);
    });
  }, 1000);
};

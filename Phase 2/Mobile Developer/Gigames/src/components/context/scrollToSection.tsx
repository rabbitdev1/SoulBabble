const scrollToSection = (scrollViewRef: any, y: any) => {
  if (scrollViewRef.current) {
    scrollViewRef.current.scrollTo({y: y, animated: true});
  }
};
export default scrollToSection;

import { createContext, useContext, useEffect, useState } from "react";

export const HeadingContext = createContext<{
  backButton: boolean;
  showBackButton: Function;
}>({
  backButton: false,
  showBackButton: () => {}
});

const HeadingStateProvider = ({ children }: any) => {
  const [backButton, showBackButton] = useState(false);

  return (
    <HeadingContext.Provider value={{ backButton, showBackButton }}>
      {children}
    </HeadingContext.Provider>
  );
};

export const useSetHeadingBackButtonToggle = (value: boolean) => {
  const { showBackButton } = useContext(HeadingContext);

  useEffect(() => {
    showBackButton(value);
  }, [showBackButton, value]);
};

export default HeadingStateProvider;


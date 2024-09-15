import { FC, ReactNode } from "react";

type BoxProps = {
  children: ReactNode;
};
const Box: FC<BoxProps> = ({ children }) => {
  return (
    <div className="relative bg-white bg-opacity-10 py-10 px-12 rounded-xl shadow-2xl backdrop-blur-md md:w-[780px] mx-auto text-center mt-6">
      {children}
    </div>
  );
};

export default Box;

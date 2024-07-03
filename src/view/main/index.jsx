import Map from "./map";
import Sidebar from "./sidebar";
import ComparisonMenu from "./slideout";

export const MainView = () => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen overflow-hidden">
      <div className="flex">
        <Sidebar classname="h-screen" />
        <Map classname="h-screen" />
      </div>
      <ComparisonMenu />
    </div>
  );
};

export default MainView;

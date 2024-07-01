import Map from "./map";
import Sidebar from "./sidebar";

export const MainView = () => {
  return (
    <div className="flex">
      <Sidebar classname="h-screen" />
      <Map classname="h-screen" />
    </div>
  );
};

export default MainView;

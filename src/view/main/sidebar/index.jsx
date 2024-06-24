import { destinations } from "../signals";

const INITIAL_VALUES = {
  x: 100,
  y: 100,
  width: 100,
  height: 100
};

export const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen bg-blue-500 w-1/6">
      <button
        className="bg-gray-300 rounded-lg p-2 m-3"
        onClick={() => destinations.value = [...destinations.value, {...INITIAL_VALUES, index: destinations.value.length}]}
      >
        Add a destination
      </button>
    </div>
  )
}

export default Sidebar;

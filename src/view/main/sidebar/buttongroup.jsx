import { useRef, useState } from "react";

import { Icon } from "@iconify/react";

export const ButtonGroup = ({ title, buttons, startCollapsed = false }) => {
  const [collapsed, setCollapsed] = useState(startCollapsed);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="py-3 mx-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{title}</h3>
        <button className="text-gray-700" onClick={toggleCollapsed}>
          {collapsed ? (
            <Icon
              icon={"solar:alt-arrow-down-outline"}
              className="ml-2 w-6 h-6"
            />
          ) : (
            <Icon
              icon={"solar:alt-arrow-up-outline"}
              className="ml-2 w-6 h-6"
            />
          )}
        </button>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-1">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2"
              onClick={button.onClick}
            >
              {button.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const AlgorithmWithInputs = ({
  title,
  inputs,
  onClick,
  startCollapsed = false,
}) => {
  const inputsRef = useRef([]);
  const [collapsed, setCollapsed] = useState(startCollapsed);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="py-3 mx-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{title}</h3>
        <button className="text-gray-700" onClick={toggleCollapsed}>
          {collapsed ? (
            <Icon
              icon={"solar:alt-arrow-down-outline"}
              className="ml-2 w-6 h-6"
            />
          ) : (
            <Icon
              icon={"solar:alt-arrow-up-outline"}
              className="ml-2 w-6 h-6"
            />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="flex flex-col gap-2">
          {inputs.map((input, index) => (
            <div
              className="flex justify-between text-sm items-center"
              key={index}
            >
              <p>{input.title}</p>
              <input
                ref={(ir) => (inputsRef.current[index] = ir)}
                className="bg-gray-100 rounded-lg p-2 text-sm w-1/2"
                type="number"
                defaultValue={input?.default ?? 3}
              />
            </div>
          ))}

          <button
            className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2"
            onClick={() => onClick(inputsRef.current)}
          >
            Solve!
          </button>
        </div>
      )}
    </div>
  );
};

export default { ButtonGroup, AlgorithmWithInputs };

import { useState } from "react";

import { Icon } from "@iconify/react";
import { algorithmStats } from "../signals";
import { useSignalEffect } from "@preact/signals-react";

export const ComparisonMenu = ({ startCollapsed = true }) => {
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const [refreshKey, setRefreshKey] = useState(0);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useSignalEffect(() => {
    algorithmStats.value.length; // Just here so it triggers the effect
    setRefreshKey((refreshKey + 1) % 2);
  });

  return (
    <div
      key={refreshKey}
      className={`absolute bottom-0 right-5 bg-gray-300 p-2 w-72 transform transition ${collapsed ? "translate-y-[calc(100%-2.5rem)]" : "translate-y-0"} rounded-t-md`}
    >
      <div>
        <button
          className="flex justify-between items-center pb-2 w-full border-b border-gray-400"
          onClick={toggleCollapsed}
        >
          <h2 className="text-left">Compare solutions</h2>
          {collapsed ? (
            <Icon
              icon={"solar:alt-arrow-up-outline"}
              className="ml-2 w-6 h-6 text-gray-700"
            />
          ) : (
            <Icon
              icon={"solar:alt-arrow-down-outline"}
              className="ml-2 w-6 h-6 text-gray-700"
            />
          )}
        </button>

        <div className="text-sm font-mono divide-y divide-gray-400">
          {algorithmStats.value.map((stats, index) => (
            <div key={index} className="py-1">
              <h3>{stats[0]}</h3>
              <div className="flex justify-between">
                <p>{stats[1].length.toFixed(0)} px</p>
                <p>{stats[1].paths} tries</p>
                <p>{stats[1].time.toFixed(1)} s</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonMenu;

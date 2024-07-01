import { Stage, Layer } from "react-konva";
import { useRef, useEffect, useState } from "react";
import { effect } from "@preact/signals-react";

import { blocksize, mapSize, destinations } from "../signals";

import { Robot } from "./robot";
import { Destination } from "./destination";
import { Path } from "./path";

export const Map = () => {
  const mapRef = useRef();

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [destinationList, setDestinationList] = useState([
    ...destinations.value,
  ]);

  // Trigger on load and unload of component
  useEffect(() => {
    const updateSize = () => {
      if (mapRef.current) {
        const mapObj = {
          width: mapRef.current.clientWidth,
          height: mapRef.current.clientHeight,
        };

        setDimensions(mapObj);
        mapSize.value = mapObj;
      }
    };

    effect(() => setDestinationList(destinations.value));
    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="flex-grow h-screen bg-gray-100" ref={mapRef}>
      {dimensions.width && dimensions.height && (
        <Stage width={dimensions.width} height={dimensions.height}>
          <Layer>
            {destinationList.map((dest, index) => (
              <Destination
                key={index}
                initialValues={dest}
                draggable={true}
                blocksize={blocksize}
                mapSize={{ x: dimensions.width, y: dimensions.height }}
              />
            ))}
            <Robot mapSize={{ x: dimensions.width, y: dimensions.height }} />
            <Path />
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default Map;

import { Stage, Layer, Circle } from 'react-konva';
import { useRef, useEffect, useState } from 'react';
import { effect } from '@preact/signals-react';

import { destinations } from '../signals';

import { Robot } from './robot';
import Destination from './destination';

const BLOCK_SIZE = 100;

export const Map = () => {
  const mapRef = useRef();

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [destinationList, setDestinationList] = useState([...destinations.value]);

  // Trigger on load and unload of component
  useEffect(() => {
    const updateSize = () => {
      if (mapRef.current) {
        setDimensions({
          width: mapRef.current.clientWidth,
          height: mapRef.current.clientHeight,
        });
      }
    };

    effect(() => setDestinationList(destinations.value));
    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="h-screen w-full bg-gray-100" ref={mapRef}>
      {dimensions.width && dimensions.height && (
        <Stage width={dimensions.width} height={dimensions.height}>
          <Layer>
            {destinationList.map((dest, index) => (
              <Destination
                key={index}
                initialValues={dest}
                draggable={true}
                blocksize={BLOCK_SIZE}
                mapSize={{x: dimensions.width, y: dimensions.height}}
              />
            ))}
            <Robot
            mapSize={{x: dimensions.width, y: dimensions.height}}
            />
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default Map;

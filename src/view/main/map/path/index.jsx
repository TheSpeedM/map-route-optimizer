import { useEffect, useState } from "react";
import { effect } from "@preact/signals-react";

import { Arrow } from "react-konva";

import { path } from "../../signals";

export const Path = () => {
  const [coords, setCoords] = useState([]);

  useEffect(() => effect(() => setCoords(path.value)), []);

  return (
    <>
      {coords.map(
        (coord, index) =>
          index !== coords.length - 1 && (
            <Arrow
              x={coord.x}
              y={coord.y}
              points={[
                0,
                0,
                coords[index + 1].x - coord.x,
                coords[index + 1].y - coord.y,
              ]}
              key={index}
              fill={"black"}
              stroke={"black"}
              strokeWidth={3}
              opacity={0.3}
            />
          )
      )}
    </>
  );
};

export default { Path };

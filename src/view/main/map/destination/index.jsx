import { useEffect, useState } from "react";
import { Group, Circle, Text } from "react-konva";

import { clamp } from "../../../../utils";
import { destinationPosition, path } from "../../signals";

const roundXY = (x, y, blocksize) => ({
  x: Math.round(x / blocksize) * blocksize,
  y: Math.round(y / blocksize) * blocksize,
});

export const Destination = ({
  initialValues,
  draggable,
  blocksize,
  mapSize,
}) => {
  const [circle, setCircle] = useState({ ...initialValues, isDragging: false });
  const [shadowCircle, setShadowCircle] = useState({ initialValues });

  const toGrid = (target) => {
    const xValue = clamp(50, target.x(), mapSize.x - 50);
    const yValue = clamp(50, target.y(), mapSize.y - 50);

    return roundXY(xValue, yValue, blocksize);
  };

  const updateSignalPos = (position) => {
    const destinationIndex = destinationPosition.value.findIndex(
      (dest) => dest.index === initialValues.index
    );

    if (destinationIndex === -1) {
      destinationPosition.value.push({
        ...position,
        index: initialValues.index,
      });
    } else {
      destinationPosition.value[destinationIndex] = {
        ...position,
        index: initialValues.index,
      };
    }
  };

  const handleOnDragStart = () => {
    setCircle({ ...circle, isDragging: true });
    path.value = [];
  };

  const handleOnDragMove = (e) => {
    setShadowCircle(toGrid(e.target));
  };

  const handleOnDragEnd = (e) => {
    const newPos = toGrid(e.target);
    setCircle({ ...newPos, isDragging: false, uniqueKey: Date.now() });
    updateSignalPos(newPos);
  };

  useEffect(
    () =>
      updateSignalPos({
        x: initialValues?.x ?? 100,
        y: initialValues?.y ?? 100,
      }),
    []
  );

  return (
    <>
      {circle.isDragging && draggable && (
        <Circle
          x={shadowCircle?.x ?? 50}
          y={shadowCircle?.y ?? 50}
          width={initialValues?.width ?? 100}
          height={initialValues?.height ?? 100}
          fill={"lightblue"}
          opacity={0.5}
        />
      )}

      <Group
        x={circle?.x ?? 100}
        y={circle?.y ?? 100}
        draggable={draggable}
        onDragStart={handleOnDragStart}
        onDragMove={handleOnDragMove}
        onDragEnd={handleOnDragEnd}
        scaleX={circle?.isDragging ? 1.2 : 1.0}
        scaleY={circle?.isDragging ? 1.2 : 1.0}
        key={circle?.uniqueKey} // This is to ensure rerender
      >
        <Circle
          width={initialValues?.width ?? 50}
          height={initialValues?.height ?? 50}
          fill={"lightblue"}
        />

        <Text
          text={initialValues?.index}
          x={-25}
          y={-5}
          width={50}
          height={50}
          align="center"
          verticalAlign="center"
        />
      </Group>
    </>
  );
};

export default { Destination };

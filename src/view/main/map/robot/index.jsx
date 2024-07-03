import { useEffect, useState } from "react";
import { Rect } from "react-konva";
import { clamp } from "../../../../utils";
import { robotPosition, resetSignals } from "../../signals";

export const Robot = ({ initalValues, mapSize }) => {
  const [rect, setRect] = useState({ ...initalValues, isDragging: false });

  const handleOnDragStart = (e) => {
    setRect({ ...rect, isDragging: true });
    resetSignals();
  };

  const handleOnDragEnd = (e) => {
    const newX = clamp(50, e.target.x(), mapSize.x - 100);
    const newY = clamp(50, e.target.y(), mapSize.y - 100);

    setRect({ x: newX, y: newY, isDragging: false, uniqueKey: Date.now() });

    robotPosition.value = { x: newX, y: newY };
  };

  useEffect(() => {
    robotPosition.value = {
      x: initalValues?.x ?? 100,
      y: initalValues?.y ?? 100,
    };
  }, []);

  return (
    <>
      <Rect
        x={rect?.x ?? 100}
        y={rect?.y ?? 100}
        width={initalValues?.width ?? 50}
        height={initalValues?.height ?? 50}
        fill={"pink"}
        draggable={true}
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
        scaleX={rect?.isDragging ? 1.2 : 1.0}
        scaleY={rect?.isDragging ? 1.2 : 1.0}
        key={rect?.uniqueKey}
      />
    </>
  );
};

export default { Robot };

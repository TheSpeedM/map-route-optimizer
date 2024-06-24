import { useState } from "react"
import { Group, Circle, Text } from "react-konva"

const clamp = (min, value, max) => {
  return Math.min(max, Math.max(min, value));
}

export const Destination = ({ initialValues, draggable, blocksize, mapSize }) => {
  const [circle, setCircle] = useState({ ...initialValues, isDragging: false });
  const [shadowCircle, setShadowCircle] = useState({ initialValues });

  const toGrid = (target) => {
    const xValue = clamp(50, target.x(), mapSize.x - 50);
    const yValue = clamp(50, target.y(), mapSize.y - 50);

    return {
      x: Math.round(xValue / blocksize) * blocksize,
      y: Math.round(yValue / blocksize) * blocksize
    }
  };

  const handleOnDragStart = () => {
    setCircle({ ...circle, isDragging: true });
  };

  const handleOnDragMove = (e) => {
    setShadowCircle(toGrid(e.target));
  };

  const handleOnDragEnd = (e) => {
    setCircle({ ...toGrid(e.target), isDragging: false, uniqueKey: Date.now() });
  };

  return (
    <>
      {circle.isDragging && draggable && <Circle
        x={shadowCircle?.x || 50}
        y={shadowCircle?.y || 50}
        width={initialValues?.width || 100}
        height={initialValues?.height || 100}
        fill={'lightblue'}
        opacity={0.5}
      />}

      <Group
        x={circle?.x || 100}
        y={circle?.y || 100}
        draggable={draggable}
        onDragStart={handleOnDragStart}
        onDragMove={handleOnDragMove}
        onDragEnd={handleOnDragEnd}
        scaleX={circle?.isDragging ? 1.2 : 1.0}
        scaleY={circle?.isDragging ? 1.2 : 1.0}
        key={circle?.uniqueKey} // This is to ensure rerender
      >
        <Circle
          width={initialValues?.width || 50}
          height={initialValues?.height || 50}
          fill={'lightblue'}
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
  )
}

export default Destination

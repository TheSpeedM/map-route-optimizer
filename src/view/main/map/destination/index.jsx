import { useState } from "react"
import { Circle } from "react-konva"

export const Destination = ({ initialValues, draggable, blocksize }) => {
  const [circle, setCircle] = useState({ ...initialValues, isDragging: false });
  const [shadowCircle, setShadowCircle] = useState({ initialValues });

  const toGrid = (target) => {
    return {
      x: Math.round(target.x() / blocksize) * blocksize,
      y: Math.round(target.y() / blocksize) * blocksize
    }
  };

  const handleOnDragStart = () => {
    setCircle({ ...circle, isDragging: true });
  };

  const handleOnDragMove = (e) => {
    setShadowCircle(toGrid(e.target));
  };

  const handleOnDragEnd = (e) => {
    setCircle({...toGrid(e.target), isDragging: false, uniqueKey: Date.now()});
  };

  return (
    <>
      {circle.isDragging && draggable && <Circle
        x={shadowCircle?.x || 50}
        y={shadowCircle?.y || 50}
        width={initialValues?.width || 100}
        height={initialValues?.height || 100}
        fill={'green'}
        opacity={0.5}
      />}

      <Circle
        x={circle?.x || 50}
        y={circle?.y || 50}
        width={initialValues?.width || 100}
        height={initialValues?.height || 100}
        draggable={draggable}
        fill={'green'}
        onDragStart={handleOnDragStart}
        onDragMove={handleOnDragMove}
        onDragEnd={handleOnDragEnd}
        scaleX={circle?.isDragging ? 1.2 : 1.0}
        scaleY={circle?.isDragging ? 1.2 : 1.0}
        key={circle?.uniqueKey} // This is to ensure rerender
      />
    </>
  )
}

export default Destination

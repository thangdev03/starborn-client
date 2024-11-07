import React, { useEffect, useRef, useState } from "react";
import GetCustomerHeight from "./GetCustomerHeight";
import MeasureFront from "./MeasureFront";
import MeasureSide from "./MeasureSide";
import BodyMeasureResult from "./BodyMeasureResult"

const BodyMeasureRoom = () => {
  const [stage, setStage] = useState(0);
  const [referenceHeightCentimeters, setReferenceHeightCentimeters] = useState(0);
  const REFERENCE_HEIGHT_PIXELS = 390;
  const [scalingFactor, setScalingFactor] = useState(0);

  const toNextStage = () => {
    setStage(stage + 1);
  };
  const toPrevStage = () => {
    setStage(stage - 1);
  };
  const restartStages = () => {
    setStage(0);
  }

  useEffect(() => {
    setScalingFactor(referenceHeightCentimeters / REFERENCE_HEIGHT_PIXELS);
  }, [referenceHeightCentimeters])

  const StageDisplay = () => {
    if (stage === 0) {
      return (
        <GetCustomerHeight 
          heightInput={referenceHeightCentimeters} 
          handleChangeHeight={(newValue) => setReferenceHeightCentimeters(newValue)}
          onClickNext={toNextStage}
        />
      )
    } else if (stage === 1) {
      return (
        <MeasureFront 
          onClickPrev={toPrevStage}
          toNextStage={toNextStage}
          scalingFactor={scalingFactor}
          referenceHeightPixels={REFERENCE_HEIGHT_PIXELS}
          stage={stage}
        />
      )
    } else if (stage === 2) {
      return (
        <MeasureSide 
          onClickPrev={toPrevStage}
          toNextStage={toNextStage}
          scalingFactor={scalingFactor}
          referenceHeightPixels={REFERENCE_HEIGHT_PIXELS}
          stage={stage}
        />
      )
    } else if (stage === 3) {
      return (
        <BodyMeasureResult 
          scalingFactor={scalingFactor}
          restartStages={restartStages}
        />
      )
    }
  }
  return (
    <>
      {StageDisplay()}
    </>
  );
};

export default BodyMeasureRoom;

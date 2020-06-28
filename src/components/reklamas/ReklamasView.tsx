import React, { useState, useRef, useEffect } from 'react';
import Reklamas from './Reklamas';
import ReklamaDetails from './reklama/details/ReklamaDetails';

const ReklamasView = () => {

  // Services

  const [showReklamaDetails, setShowReklamaDetails] = useState(false);
  const [reklamaId, setReklamaId] = useState<number | null>(null);

  return (
    <>
      <Reklamas
        setReklamaId={setReklamaId}
        setShowReklamaDetails={setShowReklamaDetails}
        hidden={showReklamaDetails}
      />

      {showReklamaDetails
        ? <ReklamaDetails
          setShowReklamaDetails={setShowReklamaDetails}
          reklamaId={reklamaId!}
        />
        : null
      }
    </>
  );
}

export default ReklamasView;
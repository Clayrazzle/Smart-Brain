import React from 'react';
import './FaceRecognition.css';

/*const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={imageUrl} width='500px' heigh='auto'/>
        <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
      </div>
    </div>
  );
}

export default FaceRecognition;*/

const FaceRecognition = ({ imageUrl, boxes }) => {
  console.log('Boxes:', boxes); /*This was added to determine what Boxes was returning in the array*/
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
        {boxes && boxes.map((box, index) => (
          <div key={index} className='bounding-box' style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}></div>
        ))}
      </div>
    </div>
  );
}

export default FaceRecognition;
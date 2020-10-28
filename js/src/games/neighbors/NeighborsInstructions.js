import React from 'react';
import image1 from './instructions/media/image1.png';
import image2 from './instructions/media/image2.png';
import image3 from './instructions/media/image3.png';
import image4 from './instructions/media/image4.png';
import image5 from './instructions/media/image5.png';
import image6 from './instructions/media/image6.png';


const instructionCards = [
  {
    img: image1,
    content: <div>
      <p> Neighbors is a kind of make-your-own sundae bar. You’ll create a customized dish from just a few simple ingredients. </p>
    </div>,
  },
  {
    img: image2,
    content: <div>
      <p> <strong>Goal:</strong> place identical numbers in neighboring cells. </p>
    </div>,
  },
  {
    img: image3,
    content: <div>
      <p> Roll the ten-sided die, then place this number in an empty spot somewhere on your grid. </p>
    </div>,
  },
  {
    img: image4,
    content: <div>
      <p> Whenever like numbers (e.g., 4-4 or 7-7-7) appear as neighbors in a row or column, you’ll score their sum. </p>
    </div>,
  },
  {
    img: image5,
    content: <div>
      <p> A single <strong>number may score twice:</strong> once in its row, and once in its column. It’s important how you arrange the numbers! </p>
    </div>,
  },
  {
    img: image6,
    content: <div>
      <p> Highest score wins. </p>
    </div>,
  },
];


const NeighborsInstructions = {
  getInstructionCards: () => instructionCards,
};


export default NeighborsInstructions;


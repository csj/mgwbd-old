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
      <p> Walter Joris has created more than 150 games. He considers Sequencium his masterpiece. </p>
      <p> The goal is simple: <strong>reach a higher maximum number than your opponent.</strong> </p>
    </div>,
  },
  {
    img: image2,
    content: <div>
      <p> On each turn, choose a square <strong>adjacent to one of your existing numbers.</strong> (Diagonals count.) A <strong>new number, 1 greater</strong> than its same-color neighbor, will be built there. </p>
    </div>,
  },
  {
    img: image3,
    content: <div>
      <p> You may <strong>build off of any of your existing numbers</strong>, even lower ones. Also, it’s <strong>okay to cross an existing path</strong> along a diagonal. </p>
    </div>,
  },
  {
    img: image4,
    content: <div>
      <p> <strong>Play until the board is filled</strong>, even if one player becomes unable to move. </p>
    </div>,
  },
  {
    img: image5,
    content: <div>
      <p> The winner is whoever, in the end, has the <strong>highest number in play</strong>. </p>
    </div>,
  },
  {
    img: image6,
    content: <div>
      <p> Advanced players may wish to change the rules slightly. After the first player’s opening move (which unfolds as usual), <strong>each player moves twice per turn</strong>. </p>
      <p> You may adopt this rule under “settings.” </p>
    </div>,
  },
];


const SequenciumInstructions = {
  getInstructionCards: () => instructionCards,
};


export default SequenciumInstructions;


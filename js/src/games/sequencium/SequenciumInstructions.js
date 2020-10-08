import React from 'react';
import image1 from './instructions/media/image1.png';
import image2 from './instructions/media/image2.png';
import image3 from './instructions/media/image3.png';
import image4 from './instructions/media/image4.png';
import image5 from './instructions/media/image5.png';


const instructionCards = [
  {
    img: image1,
    content: <div>
      <p> The mad visionary Walter Joris has created more than 150 games. Of these dozen dozens, he considers Sequencium his masterpiece. </p>
      <p> The goal is simple: <strong>reach a higher maximum number than your opponent</strong>. </p>
      <p> But that’s easier said than done… </p>
    </div>,
  },
  {
    img: image2,
    content: <div>
      <p> On each turn, you add a new number. <strong>It must be adjacent to an existing number of yours, and must equal this number plus 1</strong>. Diagonals count as adjacent. </p>
    </div>,
  },
  {
    img: image3,
    content: <div>
      <p> You may <strong>build off of any of your existing numbers</strong>, even lower ones. </p>
      <p> Also, it’s <strong>okay to cross an existing path</strong> along a diagonal. </p>
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
    img: image5,
    content: <div>
      <p> Advanced players may wish to change the rules slightly. </p>
      <p> After the first player’s opening move (which unfolds as usual), <strong>each player moves twice per turn</strong>. </p>
      <p> You may adopt this rule under “settings.” </p>
    </div>,
  },
];


const SequenciumInstructions = {
  getInstructionCards: () => instructionCards,
};


export default SequenciumInstructions;


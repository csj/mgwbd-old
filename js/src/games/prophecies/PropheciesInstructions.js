import React from 'react';
import image1 from './instructions/media/image1.png';
import image2 from './instructions/media/image2.png';
import image3 from './instructions/media/image3.png';
import image4 from './instructions/media/image4.png';
import image5 from './instructions/media/image5.png';
import image6 from './instructions/media/image6.png';
import image7 from './instructions/media/image7.png';
import image8 from './instructions/media/image8.png';


const instructionCards = [
  {
    img: image1,
    content: <div>
      <p> In this game from designer Andy Juell, a prophecy isn’t just a prediction. </p>
      <p> It’s an action. </p>
      <p> And it can, in a headache-inducing way, alter the very future that it aims to forecast… </p>
    </div>,
  },
  {
    img: image2,
    content: <div>
      <p> <strong>Your goal</strong>: Accurately predict how many numbers will appear in a given row or column, by writing that number somewhere in the row or column. </p>
    </div>,
  },
  {
    img: image3,
    content: <div>
      <p> Take turns <strong>marking empty cells with either a number or an X</strong>. Each number is a kind of prophecy: a <strong>prediction of how many numbers will eventually appear in that row or column</strong>. </p>
      <p> Thus, the smallest usable number is 1, and the largest is the length of the row or column (whichever is larger). </p>
      <p> Meanwhile, an <strong>X simply fills up a spot</strong>, ensuring no number appears there. </p>
    </div>,
  },
  {
    img: image4,
    content: <div>
      <p> To avoid repeat prophecies, <strong>no number can appear more than once in a given row or column</strong>. </p>
    </div>,
  },
  {
    img: image5,
    content: <div>
      <p> <strong>If a cell becomes impossible to fill</strong>, because any number would be a repeat prophecy, <strong>an X will automatically appear</strong>. </p>
    </div>,
  },
  {
    img: image6,
    content: <div>
      <p> Play until the board is full. Then, <strong>whoever made the correct prophecy in each row (and each column) is awarded that number of points</strong>. </p>
    </div>,
  },
  {
    img: image7,
    content: <div>
      <p> Note that <strong>a single prophecy may score twice</strong>: once in its row, and once in its column. Meanwhile, <strong>some rows or columns may contain no correct prophecy</strong>. </p>
    </div>,
  },
  {
    img: image8,
    content: <div>
      <p> <strong>Whoever scores more points is the winner</strong>. </p>
    </div>,
  },
];


const PropheciesInstructions = {
  getInstructionCards: () => instructionCards,
};


export default PropheciesInstructions;


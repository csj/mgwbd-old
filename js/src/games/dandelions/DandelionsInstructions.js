import React from 'react';
import image1 from './instructions/media/image1.png';
import image11 from './instructions/media/image11.png';
import image12 from './instructions/media/image12.png';
import image3 from './instructions/media/image3.png';
import image4 from './instructions/media/image4.png';
import image8 from './instructions/media/image8.png';
import image9 from './instructions/media/image9.png';


const instructionCards = [
  {
    img: image1,
    content: <div>
      <p> I know your dreams, my friend. You wish to be a dandelion, riding the winds, borne across fields of— </p>
      <p> No, I’m sorry. Misread that. You wish to be the wind itself, sweeping across the— </p>
      <p> No… wait… you want to be… <em>both</em>?  </p>
      <p> Aha! I have just the game for you.  </p>
    </div>,
  },
  {
    img: image1,
    content: <div>
      <p> So, what’s your goal? </p>
      <p> <strong>Dandelions</strong>: Cover the whole meadow. </p>
      <p> <strong>Wind</strong>: Leave at least one square of meadow uncovered. </p>
    </div>,
  },
  {
    img: image3,
    content: <div>
      <p> Throughout the game, <strong>the Dandelions will plant seven flowers, one at a time</strong>. </p>
    </div>,
  },
  {
    img: image4,
    content: <div>
      <p> <strong>After each planting, the Wind will blow a gust in any of the eight compass directions</strong>. Each direction can be used <strong>only once</strong>. One direction will go unused. </p>
    </div>,
  },
  {
    img: image8,
    content: <div>
      <p> When the wind blows, <strong>it carries the seeds of every existing dandelion</strong>. Any empty square downwind of a dandelion will become occupied by a seed. </p>
    </div>,
  },
  {
    img: image9,
    content: <div>
      <p> Seeds do not create new seeds; only dandelions do. But if you like, you <strong>may plant a new dandelion where there is already a seed</strong>. </p>
    </div>,
  },
  {
    img: image11,
    content: <div>
      <p> After the seventh gust of wind, if the dandelions and their seeds <strong>cover the whole board, then the Dandelions win</strong>. </p>
    </div>,
  },
  {
    img: image12,
    content: <div>
      <p> If not, then the Wind is the winner. </p>
    </div>,
  },
];


const DandelionsInstructions = {
  getInstructionCards: () => instructionCards,
};


export default DandelionsInstructions;


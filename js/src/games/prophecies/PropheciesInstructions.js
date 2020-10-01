import React from 'react';
import ReactMarkdown from 'react-markdown';
import image1 from './instructions/media/image1.png';
import image2 from './instructions/media/image2.png';
import image3 from './instructions/media/image3.png';
import image4 from './instructions/media/image4.png';
import image5 from './instructions/media/image5.png';
import image6 from './instructions/media/image6.png';
import image7 from './instructions/media/image7.png';
import image8 from './instructions/media/image8.png';
import {Carousel} from 'primereact/carousel';


const content = `
## **Prophecies**

A prophecy isn’t just a prediction. It’s an action. You can’t tell an expecting couple “your baby is
going to kill papa and marry mama” without wreaking some rather drastic changes in their
parenting style. Similarly, you can’t tell an audience of millions “I expect this stock to go skyhigh!”
without prompting a few extra purchases. Every prophecy changes the world that it sets
out to predict. It’s as if meteorologists spelled out their forecasts by geoengineering lettershaped
clouds.

All this lies in the background of Prophecies, an elegant game designed by Andy Juell. It’s a case
study in self-fulfilling—and self-defeating—predictions.

## **How to Play**

**What do you need?** Two players, each using a different color. Also, a rectangular grid (square is
perhaps preferable, but not necessary) with 4 to 8 rows, and 4 to 8 columns.

![](${image1})

**What’s the goal?** Accurately predict how many numbers will appear in a given row or column,
by writing that number somewhere in the row or column.

**What are the rules?**

1.  Take turns **marking empty cells with either a number or an X**.

![](${image2})

2.  Each number is a kind of prophecy: a **prediction of how many numbers will eventually
appear in that row or column**. Thus, the smallest usable number is 1, and the largest is
the length of the row or column (whichever is larger). Meanwhile, an **X simply fills up a
spot**, ensuring no number appears there.

![](${image3})

3.  To avoid repeat prophecies, **no number can appear twice in a given row or column**.

![](${image4})

4.  **If a cell becomes impossible to fill**, because any number would be a repeat prophecy,
**mark it with an X**. This is just a friendly act of bookkeeping; it does not count as a turn.

![](${image5})

5.  Play until the board is full. Then, count the numbers appearing in each row. **Whoever
made the correct prophecy in that row is awarded that number of points**. Then do the
same for columns.

![](${image6})

Note that **a single prophecy may score twice** (once in its row, and once in its column).
Meanwhile, some rows or columns may contain **no correct prophecy**.

![](${image7})

6.  **Whoever scores more points is the winner**. A tie counts as a second-player win.

![](${image8})

## **Variations**

**Multiplayer:** The game also works with 3 or 4 players. Just use a larger board (e.g., 7 by 7).

**X-Prophecies:** Treat each number as a prediction of the *number of X’s* in its row or column
(rather than the number of numbers).

**Sudoku Board:** Use an unsolved sudoku as your board. Each prophecy applies not only to its
row and column, but also to the 3‐by‐3 square where it belongs. (Preexisting numbers count for
neither player.)

**Exotic Boards:** Rather than a grid, you can play on any collection of overlapping cells.
`;


const cardContent = [
];


const PropheciesInstructions = props => {

  const renderCarousel = cards => {
    return <Carousel value={cards} itemTemplate={renderMarkdown} />;
  };

  const renderMarkdown = content => {
    return <ReactMarkdown source={content} />;
  };

  return (
    <div className='PropheciesInstructions'>
      {renderCarousel(cardContent)}
    </div>
  );
};


export default PropheciesInstructions;


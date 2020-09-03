import React from 'react';
import ReactMarkdown from 'react-markdown';
import image1 from './instructions/media/image1.png';
import image10 from './instructions/media/image10.png';
import image11 from './instructions/media/image11.png';
import image12 from './instructions/media/image12.png';
import image2 from './instructions/media/image2.png';
import image3 from './instructions/media/image3.png';
import image4 from './instructions/media/image4.png';
import image5 from './instructions/media/image5.png';
import image6 from './instructions/media/image6.png';
import image7 from './instructions/media/image7.png';
import image8 from './instructions/media/image8.png';
import image9 from './instructions/media/image9.png';


const content = `
## **Dandelions**

I know your dreams, my friend. You wish to be a dandelion, riding the
winds, a sentient piece of fluff borne across the fields of—

No, wait, I’m sorry. Misread that dream. You wish to be the wind itself,
sweeping the fluff from the dandelions and carrying it—

No, wait. I see now. You want to be… *both*?

Aha! I have just the game for you.

## **How to Play**

**How many players?** Two: the Dandelions, and the Wind.

![](${image1})

**What do you need?** Paper and pencil. Draw a five-by-five grid, plus a
little compass rose.

![](${image2})

**What’s the goal?** The Dandelions aim to cover the whole meadow. The
Wind aims to leave at least one square of the meadow uncovered.

**What are the rules?**

1.  The Dandelions move first, by **placing a flower** (i.e., an
    asterisk) anywhere in the grid.

![](${image3})


2.  The Wind moves next, by **blowing a gust in any of the eight
    directions**: North, South, Northwest, Southeast, and so on. (Note:
    unlike meteorologists, for whom a Northern wind blows *from* the
    North, I call a wind “North” if it blows *toward* the North.)

![](${image4})


(The wind may blow **only once in each direction**, so once a direction
is used, mark it off on the compass rose.)

![](${image5})


3.  Every dandelion’s **seeds are carried in the wind’s direction**. Any
    vacant square downwind of a dandelion is now occupied by a seed
    (i.e., a dot).

![](${image6})


4.  Continue taking turns. A **dandelion is planted**…

![](${image7})

…and then **the wind blows, carrying the seeds of ALL dandelions**
on the board.

![](${image8})


5.  You may, if you like, plant a new dandelion **where there is already
    a seed**.

![](${image9})


6.  **Each player gets 7 moves**. Thus, a total of 7 dandelions are
    planted, and the wind blows 7 times (using up every direction except
    one).

![](${image10})


7.  If the dandelions and their seeds **cover the whole board**, **then
    the Dandelions win.**

![](${image11})


8.  If not, then **the Wind wins**.

![](${image12})


## **Variations**

**Larger Meadow:** If the Dandelions are finding victory too easy, try a
6 by 6 grid.

**Double Planting:** If the Wind is finding victory too easy, then have
the dandelions begin the game with a “double turn” (i.e., two Dandelions
are planted), while the Wind ends the game with a “double turn” (i.e.,
after the seventh Dandelion is planted, the wind blows twice).

**Keeping Score:** Switch to a larger board (I suggest 7 by 7), so that
the Dandelions will struggle to cover the full board. Play one round
each as the Dandelions and as the Wind. As the Wind, you score a point
for each square that’s left uncovered.

**Collaborative (or Solo):** Have the wind work *together* with the
Dandelions, so that both want to cover the whole board. What’s the
largest board you can manage? (Start with 8 by 8.)

**The Collaborative Puzzle:** With collaborative play, how many squares
can the Dandelions cover on an *n* by *n* grid? (An open mathematical
problem!)
`;


class DandelionInstructions extends React.Component {
  render() {
    return (
      <div className='DandelionInstructions'>
        <ReactMarkdown source={content} />
      </div>
    );
  }
}


export default DandelionInstructions;

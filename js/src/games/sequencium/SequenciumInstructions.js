import React from 'react'; import ReactMarkdown from 'react-markdown';
import image1 from './instructions/media/image1.png';
import image2 from './instructions/media/image2.png';
import image3 from './instructions/media/image3.png';
import image4 from './instructions/media/image4.png';
import image5 from './instructions/media/image5.png';


const content = `
## **Sequencium**
### *A Game of Rival Chains*

  ## **How to Play**

**What do you need?** Two players, using different colors on a 6-by-6
grid. Set up the board like this. (For a longer game, you can try
8-by-8, or 7-by-7 with the middle square blacked out.)

![](${image1})

**What’s the goal?** Reach a higher maximum number than your opponent
reaches.

**What are the rules?**

1.  On each turn, (a) **pick one your existing numbers**, (b) **add
    one** to it, and (c) write the **new number in an adjacent cell**.
    Diagonals count as adjacent.

![](${image2})

2.  You may **build off of any of your existing numbers**, as long as
    there is space to do so. Also note that it’s **okay to cross an
    existing path** along a diagonal.

![](${image3})

3.  Play **until the board fills up**, even if one player becomes unable
    to move.

![](${image4})

4.  The winner is whoever, in the end, has the **highest number in
    play**.

![](${image5})

5.  The game described thus far has an Achilles heel: the second player,
    by mirroring the moves of the first, can guarantee a draw. I thus
    advise a simple tweak: **starting with the second player’s first
    turn,** **each player moves twice per turn**. (The first player’s
    opening turn remains a single move.)

## **Tasting Notes**

Sequencium is sneaky little shapeshifter: a spatial game, disguised as a
number game.

The numbers, as you’ll see, are just a surface feature. They’re nothing
more than a way to track the length of the chains that you’re building.
To build the longest chain, you’ll need to turn off your numerical
brain, and turn on your territorial brain. Where is your opponent
threatening to extend her forces? Where can you extend yours?

By the end of the game, you may feel less like rival humans, and more
like rival sentient plants, each sending forth your tendrils to choke
off your enemy’s growth and secure your own.

## **Where It Comes From**

One of my very favorite minds belongs to a fellow named Walter Joris. He
generates games, puzzles, and peculiar pencil-and-paper experiments with
such intensity and regularity that he must be a kind of pulsar: some
heretofore unknown astronomical object, emitting what I admiringly call
Joris Radiation.

His book is called *100 Strategic Games*, but Walter has actually
created more like 150 or 200. You lose track when you’re that prolific.
But he hasn’t lost track of which is his favorite: of all those dozen
dozens, his crown jewel is Sequencium.

## **Variations**

**Four Players:** Play on
larger grid (8 by 8 or 10 by 10), with each player’s chain beginning in
a different corner.
`;


class SequenciumInstructions extends React.Component {
  render() {
    return (
      <div className='SequenciumInstructions'>
        <ReactMarkdown source={content} />
      </div>
    );
  }
}


export default SequenciumInstructions;

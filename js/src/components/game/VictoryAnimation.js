import './VictoryAnimation.scss';
import PlayerHelper from 'players/PlayerHelper';
import React, {useEffect, useState} from 'react';
import {Transition} from 'react-transition-group';


const MAX_DELAY_MS = 1000;


const defaultStyle = {
  opacity: 0,
}
const transitionStyles = {
  entering: {},
  entered: { opacity: 1 , transform: 'scale(0)' }, // Before
  exiting: { opacity: 0, transform: 'scale(1)' }, // During
  exited: {},
};
const animationParams = {
  MAX_X_PX: 500,
  MAX_Y_PX: 500,
};
const makeAnimatedItemFromText = (playerStyleClass, text) =>
    makeAnimatedItemFromElement(playerStyleClass, <div>{text}</div>);
const makeAnimatedItemFromElement = (playerStyleClass, el) => ({
  playerStyleClass,
  el,
  delayMs: Math.random() * MAX_DELAY_MS,
  styles: {exiting: makeRandomTransformStyle()},
  in: true,
});
const makeRandomTransformStyle = () => {
  let tx = animationParams.MAX_X_PX * (Math.random() * 2 - 1);
  let ty = animationParams.MAX_Y_PX * (Math.random() * 2 - 1);
  return { transform: `scale(5) translate(${tx}px, ${ty}px)` };
};


const TransitionItem = props => {
  let item = props.item;
  let ref = React.useRef();
  return (
    <Transition
        in={item.in} timeout={1000}
        nodeRef={ref}
        mountOnEnter={true} unmountOnExit={item.unmountOnExit}>
      {state => (
        <div
            className={`animatedItem ${item.playerStyleClass}`}
            ref={ref}
            style={{
                ...defaultStyle,
                ...transitionStyles[state],
                ...item.styles[state]}}>
          {item.el}
        </div>
      )}
    </Transition>
  );
};


const OutcomeEl = props => {
  const [outcomeVisible, setOutcomeVisible] = useState(true);
  let players = props.players;
  if (players.length === 1) {
    return (
      <div
          className={`outcome ${outcomeVisible ? null : 'hidden'}`}
          onClick={() => setOutcomeVisible(false)}>
        <div className='icon'>
          <img src={PlayerHelper.getAvatar(players[0])} alt='avatar' />
        </div>
        <div className='label'>winner!</div>
      </div>
    );
  }

  if (players.length === 0) {
    return null;
  }

  return (
    <div
        className={`outcome ${outcomeVisible ? null : 'hidden'}`}
        onClick={() => setOutcomeVisible(false)}>
      <div className='label'>draw!</div>
    </div>
  );
};


/**
 * props:
 *   gameEnd: Object
 *   players: Array
 */
const VictoryAnimation = props => {

  const [animatedItems, setAnimatedItems] = useState([]);
  const isWin = props.gameEnd && 'win' in props.gameEnd;
  const isDraw = props.gameEnd && 'draw' in props.gameEnd;

  useEffect(() => { // Create animated items
    if (!isWin && !isDraw) {
      return;
    }
    let players = isWin ?
        [props.players[props.gameEnd['win']]] :
        [...props.players];
    let victoryPlayerStyles = players.map(PlayerHelper.getStyleClass);
    let outcomeItem = {
      playerStyleClass: isWin ? victoryPlayerStyles[0] : null,
      el: <OutcomeEl players={players} />,
      delayMs: MAX_DELAY_MS,
      styles: {exiting: {opacity: 1}, exited: {opacity: 1}},
      in: true,
      unmountOnExit: false,
    };
    let items = [
      ...Array(80).fill(null).map((_, i) =>
        makeAnimatedItemFromText(
            victoryPlayerStyles[i % victoryPlayerStyles.length], i % 10)
      ),
      outcomeItem,
    ];
    setAnimatedItems(items);
    let timers = items.map(item =>
      setTimeout(() => {
        item.in = false;
        setAnimatedItems(items => [...items]);
      }, item.delayMs)
    );
    return () => timers.forEach(clearTimeout);
  }, [isWin, isDraw, props.gameEnd, props.players]);

  return (
    <div className='VictoryAnimation'>
      {animatedItems.map((item, i) => <TransitionItem key={i} item={item} />)}
    </div>
  );
};


export default VictoryAnimation;

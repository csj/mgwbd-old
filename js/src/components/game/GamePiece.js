import './GamePiece.scss';
import GamePieceHelper from 'games/GamePieceHelper';
import React, {useEffect, useState} from 'react';


/**
 * props
 *   className
 *   type
 *   player
 *   hashMaterial
 */
const GamePiece = props => {
  const [url, setUrl] = useState();

  useEffect(() => {
    setUrl(
        GamePieceHelper.getGamePiece(
            props.player.style, props.type, props.hashMaterial));
  }, [props.type, props.player, props.hashMaterial]);

  return (
    <div
        className={`GamePiece ${props.className}`}
        style={{backgroundImage: `url(${url})`}} />
  );
};


export default GamePiece;

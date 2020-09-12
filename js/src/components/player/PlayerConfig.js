import './PlayerConfig.scss';
import Copyable from 'components/chrome/Copyable';
import InfoBubble from 'components/chrome/InfoBubble';
import PlayerHelper from 'players/PlayerHelper';
import React, {useEffect, useState} from 'react';
import {Accordion, AccordionTab} from 'primereact/accordion';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {OverlayPanel} from 'primereact/overlaypanel';


const playerReady = <InfoBubble
    text='Player is ready' icon='pi-check-circle' position='left' />;
const playerWaiting = <InfoBubble
    text='No player here! Take a seat or invite a friend.'
    icon='pi-exclamation-triangle'
    position='left' />;


/**
 * props:
 *   players
 *   onCommit(players)
 *   readOnly
 */
const PlayerConfig = props => {
  const [editPlayerNum, setEditPlayerNum] = useState(null);
  const [editedName, setEditedName] = useState(null);
  const [editedNameTimer, setEditedNameTimer] = useState(null);
  let avatarPanelRef = null;

  useEffect(() => { // Debounce name typing.
    clearTimeout(editedNameTimer);
    if (editedName && editPlayerNum != null) {
      setEditedNameTimer(setTimeout(() => onCommitName(editedName), 500));
    }
    return clearTimeout(editedNameTimer);
  }, [editPlayerNum, editedName]);

  const onSwap = (index1, index2) => {
    let tempPlayer = props.players[index1];
    props.players[index1] = props.players[index2];
    props.players[index2] = tempPlayer;
    setEditPlayerNum(null);
    props.onCommit && props.onCommit(props.players);
  };

  const onCommitStyle = style => {
    props.players[editPlayerNum].style = style;
    props.onCommit && props.onCommit(props.players);
  };

  const onCommitName = name => {
    props.players[editPlayerNum].name = name;
    props.onCommit && props.onCommit(props.players);
  };

  const onCommitToggleType = () => {
    // if i don't own this player, own it
    // if i do own this player, set it to null
    let player = props.players[editPlayerNum];
    PlayerHelper.isClaimedByMe(player) ?
        PlayerHelper.unclaimPlayer(player) :
        PlayerHelper.claimPlayer(player);
    props.onCommit && props.onCommit(props.players);
  };

  const avatarFor = (playerOrStyle) => {
    let img = PlayerHelper.getAvatar(playerOrStyle);
    return { backgroundImage: `url(${img})` };
  };

  const renderAvatarSelector = () => {
    let styles = PlayerHelper.getAllStyles();
    return (
      <OverlayPanel ref={el => avatarPanelRef = el}>
        {styles.map(s => <div
            className='avatar avatarChoice' key={s} style={avatarFor(s)}
            onClick={() => onCommitStyle(s)} /> )}
      </OverlayPanel>
    );
  };

  const renderEditablePlayer = (player, index) => {
    let avatarJsx = (
      <div
          className='avatar' style={avatarFor(player)}
          onClick={e => avatarPanelRef.toggle(e)} />
    );
    let nameJsx = (
      <div className={`playerName ${PlayerHelper.getStyleClass(player)}`}>
        <InputText
            value={editedName} onChange={e => setEditedName(e.target.value)} />
      </div>
    );
    let typeJsx = (
      <div className='type'>
        <Button
            label={PlayerHelper.getType(player)} className='p-button-outlined'
            onClick={() => onCommitToggleType()} />
      </div>
    );
    return [avatarJsx, nameJsx, typeJsx];
  };

  const renderPlayer = (player, index) => {
    let editable = editPlayerNum === index;
    let avatarJsx = <div className='avatar' style={avatarFor(player)} />;
    let nameJsx = (
      <div className={`playerName ${PlayerHelper.getStyleClass(player)}`}>
        <div>{player.name}</div>
      </div>
    );
    let typeJsx = <div className='type'>{PlayerHelper.getType(player)}</div>;
    if (editable) {
      [avatarJsx, nameJsx, typeJsx] = renderEditablePlayer(player, index);
    }

    return (
      <div className={`player ${editable ? 'editable' : ''}`} key={index}>
        <InfoBubble
            className='moveUp' icon='pi-angle-up' text='Move player up'
            onClick={() => onSwap(index - 1, index)} />
        <InfoBubble
            className='moveDown' icon='pi-angle-down' text='Move player down'
            onClick={() => onSwap(index, index + 1)} />
        <InfoBubble
            text='Edit name, avatar, or player type' icon='pi-user-edit'
            className='edit'
            onClick={() => {
              let val = editable ? null : index;
              setEditPlayerNum(val);
              setEditedName(val !== null ? props.players[val].name : null);
            }} />
        {avatarJsx}
        {nameJsx}
        {typeJsx}
        {player.owner ? playerReady : playerWaiting}
      </div>
    );
  };

  const renderReadOnlyMessage = () => {
    return (
      <div className='readOnlyMessage'>
        You may modify settings between games.
      </div>
    );
  };

  const renderShareLink = () => {
    return (
      <div className='shareLink'>
        <Copyable label='copy game link' value={'dkfjlsdkfjsdlkfddkfjlsdkfjsdlkfddkfjlsdkfjsdlkfdsssdkfjlsdkfjsdlkfds'} />
      </div>
    );
  };

  const renderMoreInfo = () => (
    <div>
      accordiontab
    </div>
  );

  return (
    <div className={`
          PlayerConfig ${props.className} ${props.readOnly ? 'readOnly' : ''}`}>
      {renderReadOnlyMessage()}
      {renderAvatarSelector()}
      <div className='players'>
        {props.players.map(renderPlayer)}
      </div>
      {renderShareLink()}
      {renderMoreInfo()}
    </div>
  );
};


export default PlayerConfig;

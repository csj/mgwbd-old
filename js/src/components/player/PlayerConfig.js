import './PlayerConfig.scss';
import Copyable from 'components/chrome/Copyable';
import GameManager from 'games/GameManager';
import InfoBubble from 'components/chrome/InfoBubble';
import LabelValue from 'components/chrome/LabelValue';
import PlayerHelper from 'players/PlayerHelper';
import React, {useEffect, useState} from 'react';
import useXhr from 'components/http/useXhr';
import {Accordion, AccordionTab} from 'primereact/accordion';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {OverlayPanel} from 'primereact/overlaypanel';


const playerReady = <InfoBubble
    text='Player is ready' icon='pi-check-circle' position='left' />;
const playerWaiting = <InfoBubble
    text='No player here! Take a seat or invite a friend.'
    icon='pi-exclamation-triangle'
    position='left' />;

const defaultNewPlayer = {
    'playerType': 'human', 'owner': null, 'name': 'Player 1', 'style': 'A'};
const defaultPlayerName = i => `Player ${i + 1}`;
   

/**
 * props:
 *   gameType
 *   players
 *   allowedPlayerCounts
 *   onCommit(players)
 *   readOnly
 */
const PlayerConfig = props => {
  const [editPlayerNum, setEditPlayerNum] = useState(null);
  const [editedName, setEditedName] = useState(null);
  const botList = useXhr(
      [], '/gameplay/settings/botlist', {gameType: props.gameType});
  let avatarPanelRef = null;
  let gameManager = new GameManager.Factory().create();

  useEffect(() => { // Debounce name typing.
    let timerId = null;
    if (editedName && editPlayerNum != null) {
      timerId = setTimeout(() => onCommitName(editedName), 500);
    }
    return () => clearTimeout(timerId);
  });

  useEffect(() => {
    if (props.readOnly) {
      setEditPlayerNum(null);
    }
  }, [props.readOnly]);

  const onSwap = (index1, index2) => {
    let tempPlayer = props.players[index1];
    props.players[index1] = props.players[index2];
    props.players[index2] = tempPlayer;
    setEditPlayerNum(null);
    props.onCommit && props.onCommit(props.players);
  };

  const onSetPlayerCount = n => {
    let newPlayers = props.players;
    let usedStyles = props.players.map(p => p.style);
    let availableStyles =
        PlayerHelper.getAllStyles().filter(s => usedStyles.indexOf(s) === -1);
    if (n < props.players.length) {
      newPlayers = props.players.slice(0, n);
    }
    for (let i = props.players.length; i < n; i++) {
      let style = availableStyles.shift() || defaultNewPlayer.style;
      let name = defaultPlayerName(i);
      let player = {...defaultNewPlayer, name, style};
      PlayerHelper.claimPlayer(player);
      newPlayers.push(player);
    }
    setEditPlayerNum(null);
    props.onCommit && props.onCommit(newPlayers);
  };

  const onCommitStyle = style => {
    props.players[editPlayerNum].style = style;
    props.onCommit && props.onCommit(props.players);
  };

  const onCommitName = name => {
    let player = props.players[editPlayerNum];
    if (player.name !== name) {
      props.players[editPlayerNum].name = name;
      props.onCommit && props.onCommit(props.players);
    }
  };

  const onCommitToggleType = () => {
    // Three-way toggle path: This Device, Other Device, Bot

    let isBotAllowed = botList.length > 0;
    let player = props.players[editPlayerNum];

    if (PlayerHelper.isOwnedByMe(player)) {
      PlayerHelper.unclaimPlayer(player);
    } else if (PlayerHelper.isUnowned(player) && !isBotAllowed) {
      PlayerHelper.claimPlayer(player);
      player.name = defaultPlayerName(editPlayerNum);
    } else if (PlayerHelper.isUnowned(player) && isBotAllowed) {
      PlayerHelper.setAsBot(player, botList[0]);
    } else if (PlayerHelper.isBot(player)) {
      PlayerHelper.claimPlayer(player);
      player.name = defaultPlayerName(editPlayerNum);
    }
    setEditedName(player.name);
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

  const renderName = (player, isEditable) => {
    let content = <div>{player.name}</div>;
    if (isEditable && PlayerHelper.isBot(player)) {
      content = <div>(bot list){player.name}</div>; // TODO
    } else if (isEditable) {
      content = <InputText
          value={editedName} onChange={e => setEditedName(e.target.value)} />
    }
    return (
      <div className={`playerName ${PlayerHelper.getStyleClass(player)}`}>
        {content}
      </div>
    );
  };

  const renderEditablePlayer = (player, index) => {
    let avatarJsx = (
      <div
          className='avatar' style={avatarFor(player)}
          onClick={e => avatarPanelRef.toggle(e)} />
    );
    let typeJsx = (
      <div className='type'>
        <Button
            label={PlayerHelper.getType(player)} className='p-button-outlined'
            onClick={() => onCommitToggleType()} />
      </div>
    );
    return [avatarJsx, typeJsx];
  };

  const renderPlayer = (player, index) => {
    let editable = editPlayerNum === index;
    let avatarJsx = <div className='avatar' style={avatarFor(player)} />;
    let nameJsx = renderName(player, editable);
    let typeJsx = <div className='type'>{PlayerHelper.getType(player)}</div>;
    if (editable) {
      [avatarJsx, typeJsx] = renderEditablePlayer(player, index);
    }

    return (
      <div
          className={`
              player ${editable ? 'editable' : ''}
              ${props.players.length >= 3 ? 'threeOrMorePlayers' : null}
          `}
          key={index}>
        <div className='playerRow'>
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
          <div className='spacer'>
            {editable ?  <div className='desktop'>{nameJsx}</div> : nameJsx}
          </div>
          {typeJsx}
          {player.owner ? playerReady : playerWaiting}
        </div>
        {editable ? <div className='mobile'>
          <div className='playerRow'>
            {nameJsx}
          </div>
        </div> : null}
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
        <Copyable label='copy game link' value={gameManager.getJoinLink()} />
      </div>
    );
  };

  const renderSetPlayerCountButton = n => {
    return (
      <div
          className={`
              setPlayerCountButton
              ${props.readOnly ? 'readOnly' : 'clickable'}
              ${n === props.players.length ? 'selected' : null}`}
          key={n} onClick={props.readOnly ? null : () => onSetPlayerCount(n)}>
        {n}
      </div>
    );
  };

  const renderPlayerCount = () => {
    if (!props.allowedPlayerCounts) {
      return null;
    }
    let buttons = (
      <div className='playerCountButtons'>
        {props.allowedPlayerCounts.map(renderSetPlayerCountButton)}
      </div>
    );
    return (
      <LabelValue
          className='playerCountSelector'
          label='Player count' value={buttons}
          styles={LabelValue.Style.LEFT_RIGHT} />
    );
  };

  const renderMoreInfo = () => (
    <Accordion className='moreInfo'>
      <AccordionTab header={
        <div>
          <i className="pi pi-question-circle" />
          How to play multiplayer
        </div>
      }>
        <p>It’s easy to play with a distant friend! Just follow these steps.</p>
        <ol>
          <li>Tap the <em>Edit Player</em> button.</li>
          <li>Tap <em>This Device</em> to relinquish a seat.</li>
          <li>Copy the <em>Game Link</em> and share with a friend.</li>
          <li>When your friend joins, they’ll join in the open slot.</li>
        </ol>
      </AccordionTab>
    </Accordion>
  );

  return (
    <div className={`
          PlayerConfig ${props.className} ${props.readOnly ? 'readOnly' : ''}`}>
      {renderReadOnlyMessage()}
      {renderAvatarSelector()}
      {renderPlayerCount()}
      <div className='players'>
        {props.players.map(renderPlayer)}
      </div>
      {renderShareLink()}
      {renderMoreInfo()}
    </div>
  );
};


export default PlayerConfig;

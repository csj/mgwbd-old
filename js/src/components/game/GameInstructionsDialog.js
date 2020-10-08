import './GameInstructionsDialog.scss';
import Card from 'components/chrome/Card';
import InfoDialog from 'components/chrome/InfoDialog';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import React, {useState} from 'react';


const GameInstructionsDialog = props => {
  const [page, setPage] = useState(0);
  let cards = props.game.getInstructionCards();

  const renderCard = card => {
    return (
      <Card img={card.img} text={card.content}>
        <KeyboardEventHandler
            handleKeys={['left', 'right']} handleFocusableElements={true}
            onKeyEvent={onKeyEvent} />
      </Card>
    );
  };

  const pageAdd = amount => () =>
      setPage(Math.max(page + amount, 0) % cards.length);

  const onKeyEvent = (key, evt) => {
    // 'left' and 'right' are 37 and 39, respectively.
    let newPage = page + evt.keyCode - 38;
    if (newPage >= 0 && newPage < cards.length) {
      setPage(newPage);
    }
  };

  let prevButtonConfig = {
    label: 'Prev', close: false, onClick: pageAdd(-1), disabled: !page,
    className: 'p-button-outlined',
  };
  let nextButtonConfig = {label: 'Next', close: false, onClick: pageAdd(1)};
  let closeButtonConfig = {label: 'Close'};

  return (
    <InfoDialog
        dialogClassName={
            `GameInstructionsDialog-dialogElement ${props.dialogClassName}`}
        header={`${props.game.getDisplayName()} instructions`}
        footerButtons={[
          prevButtonConfig,
          page === cards.length - 1 ? closeButtonConfig : nextButtonConfig,
        ]}
        open={props.open}
        onHide={() => setPage(0)}
        content={renderCard(cards[page])}>
    </InfoDialog>
  );
}


export default GameInstructionsDialog;


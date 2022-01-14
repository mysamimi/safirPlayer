import React, { useContext } from 'react';
import {
  Button, ListGroup, ButtonGroup, Badge, Row, Container, Col,
} from 'react-bootstrap';
import { ContextPlayerState, ACTIONS } from './player-state';

const Assign2DeckBtn = (props) => {
  const { media, index } = props;
  const {
    state: { decks },
    dispatch,
  } = useContext(ContextPlayerState);
  const click = () => {
    decks[index].media = media;
    dispatch({ type: ACTIONS.assignDeck, payload: { ...decks } });
  };
  // debugger;
  const isDisabled = decks[index].state !== 'stop';
  return (
    <Button
      disabled={isDisabled}
      variant="success"
      size="sm"
      key={`Assign2DeckBtn-${index.toString()}`}
      onClick={click}
    >
      {index + 1}

    </Button>
  );
};

const Assign2Deck = (props) => {
  const { media, deckCount } = props;
  const deckBtn = [];
  for (let i = 0; i < deckCount; i += 1) {
    deckBtn.push(<Assign2DeckBtn media={media} index={i} key={`Assign2Deck-${i.toString()}`} />);
  }
  return deckBtn;
};

export default (props) => {
  const { media, deckCount } = props;
  const items = [];

  for (let i = 0; i < media.length; i += 1) {
    items.push(
      <ListGroup.Item key={media[i].filename}>
        <Container>
          <Row>
            <Col>
              <Badge variant="secondary">{media[i].filename}</Badge>
            </Col>
            <Col>
              <ButtonGroup aria-label="Actions">
                <Assign2Deck media={media[i]} deckCount={deckCount} />
              </ButtonGroup>
            </Col>
          </Row>
        </Container>
      </ListGroup.Item>,
    );
  }
  return <ListGroup style={{ height: '800px', overflow: 'scroll' }}>{items}</ListGroup>;
};

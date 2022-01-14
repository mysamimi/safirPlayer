import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ContextPlayerStateProvider } from './player-state';
import MediaList from './mediaList';
import Deck from './deck';

export default (props) => {
  const { options: { media, deckCount } } = props;
  const decks = [];
  for (let i = 1; i <= deckCount; i += 1) {
    decks.push(<Deck id={i} key={`Deck_${i}`} />);
  }
  return (
    <ContextPlayerStateProvider deckCount={deckCount}>
      <Container>
        <Row>
          <Col>
            <MediaList media={media} deckCount={deckCount} />
          </Col>
          <Col>
            {decks}
          </Col>
        </Row>
      </Container>
    </ContextPlayerStateProvider>
  );
};

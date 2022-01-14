import React from 'react';

const ContextPlayerState = React.createContext();

const initialState = ({ deckCount }) => {
  const decks = [];
  for (let i = 0; i < deckCount; i += 1) {
    decks.push({ media: {}, state: 'stop' });
  }
  return { decks };
};
const ACTIONS = {
  assignDeck: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.assignDeck:
      return { ...state, decks: action.payload };
    default:
      return state;
  }
};

const ContextPlayerStateProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState(props));
  const value = { state, dispatch };
  const { children } = props;
  // console.log('state', state);
  return <ContextPlayerState.Provider value={value}>{children}</ContextPlayerState.Provider>;
};

const ContextPlayerStateConsumer = ContextPlayerState.Consumer;

export {
  ContextPlayerState, ContextPlayerStateProvider, ContextPlayerStateConsumer, ACTIONS,
};

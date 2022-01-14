import React, {
  useContext, useRef, useState, useEffect,
} from 'react';
import {
  Container, Row, Col, Alert, Button, Badge,
} from 'react-bootstrap';
import { ContextPlayerState, ACTIONS } from './player-state';


// const fader = (startPoint, stopPoint, step, isIn) => {
//   const [value, setValue] = React.useState(startPoint);

//   const fadeIn = () => {
//     const newVal = value + step;
//     if (step > 0 && newVal < stopPoint) {
//       setValue(newVal);
//     }
//   };
//   const fadeOut = () => {
//     const newVal = value - step;
//     if (step > 0 && newVal > stopPoint) {
//       setValue(newVal);
//     }
//   };
//   useEffect(() => {
//     const timerID = setInterval(
//       () => {
//         if (isIn) {
//           fadeIn();
//         } else {
//           fadeOut();
//         }
//       }, 1000,
//     );
//     return function cleanup() {
//       clearInterval(timerID);
//     };
//   });

//   return value;
// };

export default (props) => {
  const { id } = props;
  const index = id - 1;
  const audioRef = useRef(null);
  const {
    state: { decks },
    dispatch,
  } = useContext(ContextPlayerState);
  const [stop, setStop] = useState(0);
  const [tick, setTick] = useState(0);
  const [time, setTime] = useState({
    current: '-',
    remain: '-',
    duration: '-',
  });
  useEffect(
    () => {
      const timer1 = setInterval(() => {
        setTick(prevTick => prevTick + 1);
        // if (typeof tick === 'function') {
        //   tick();
        // } else {
        //   console.log('not function!', tick);
        // }
      }, 100);

      // this will clear Timeout when component unmont like in willComponentUnmount
      return () => {
        clearInterval(timer1);
      };
    },
    [], // useEffect will run only one time
  );

  // const [progress, setProgress] = useState({
  //   inProgress: false, step: 0, value: 0, stopPoint: 0,
  // });
  const name = decks[index].media.filename || '';
  const volume = Math.round((decks[index].media.volume || 0) * 100);
  const fadeIn = Math.round((decks[index].media.fade_in || 0) / 100) / 10;
  const fadeOut = Math.round((decks[index].media.fade_out || 0) / 100) / 10;
  const src = decks[index].media.filename ? `media/${decks[index].media.filename}` : '';
  // if (process.inProgress) {
  //   setTimeout(() => {
  //     const [progress, setProgress] = useState({
  //       inProgress: false, step: 0, value: 0, stopPoint: 0,
  //     });
  //     // const value +=
  //   });
  // }
  const stepFadeIn = decks[index].media.volume / (decks[index].media.fade_in / 100);
  const stepFadeOut = decks[index].media.volume / (decks[index].media.fade_out / 100);
  switch (decks[index].state) {
    case 'fadeIn':
      audioRef.current.volume = 0;
      audioRef.current.play();
      decks[index].state = 'fadingIn';
      // dispatch({ type: ACTIONS.assignDeck, payload: { ...decks } });

      // console.log('checkPlay fadeIn', decks.length, decks[index].state);
      if (decks[index].media.solo) {
        Object.keys(decks).forEach((i) => {
          // console.log(decks[i].state, i, index);
          if (i !== index && decks[i].state === 'play') {
            // console.log('set 2 faldeOut');
            decks[i].state = 'fadeOut';
          }
        });
      }
      dispatch({ type: ACTIONS.assignDeck, payload: { ...decks } });
      setTick(0);
      setStop(decks[index].media.fade_in / 100);

      // setTick(() => {
      //   console.log('vol', audioRef.current.volume, step, decks[index].media);
      //   audioRef.current.volume += step;
      //   if (audioRef.current.volume >= decks[index].media.volume) {
      //     decks[index].state = 'play';
      //     dispatch({ type: ACTIONS.assignDeck, payload: { ...decks } });
      //     setTick(initTick);
      //   }
      // });
      // setProgress({
      //   inProgress: true, step, value: 0, stopPoint: decks[index].media.volume,
      // });

      break;
    case 'fadingIn':
      if (tick <= stop) {
        const vol = audioRef.current.volume + stepFadeIn;
        if (vol >= 1) {
          audioRef.current.volume = 1;
        } else if (vol <= decks[index].media.volume) {
          audioRef.current.volume = vol;
        } else {
          audioRef.current.volume = decks[index].media.volume;
        }
      } else {
        decks[index].state = 'play';
        dispatch({ type: ACTIONS.assignDeck, payload: { ...decks } });
      }
      break;
    case 'fadeOut':
      decks[index].state = 'fadingOut';
      dispatch({ type: ACTIONS.assignDeck, payload: { ...decks } });
      setTick(0);
      setStop(decks[index].media.fade_out / 100);

      break;
    case 'fadingOut':
      if (tick <= stop) {
        const vol = audioRef.current.volume - stepFadeOut;
        if (vol < 0) {
          audioRef.current.volume = 0;
        } else if (vol >= 0) {
          audioRef.current.volume = vol;
        } else {
          audioRef.current.volume = 0;
          decks[index].state = 'stop';
          dispatch({ type: ACTIONS.assignDeck, payload: { ...decks } });
          audioRef.current.pause();
        }
      } else {
        decks[index].state = 'stop';
        dispatch({ type: ACTIONS.assignDeck, payload: { ...decks } });
        audioRef.current.pause();
      }
      break;

    default:
      break;
  }
  let badgeState = 'warning';
  switch (decks[index].state) {
    case 'play':
      badgeState = 'danger';
      break;
    case 'stop':
      badgeState = 'success';
      break;
    default:
      break;
  }
  return (
    <Alert variant="dark">
      <Alert.Heading>
        Deck
        {' '}
        {id}
      </Alert.Heading>
      <Container>
        <Row>
          <audio
            ref={audioRef}
            src={src}
            onEnded={() => {
              decks[index].state = 'stop';
              dispatch({ type: ACTIONS.assignDeck, payload: { ...decks } });
            }}
            onTimeUpdate={() => {
              if (audioRef.current.duration > 0) {
                const current = Math.ceil(audioRef.current.currentTime);
                const duration = Math.ceil(audioRef.current.duration);
                const remain = Math.ceil(audioRef.current.duration - audioRef.current.currentTime);
                setTime({
                  current,
                  duration,
                  remain,
                });
              }
            }}
          />
        </Row>
        <Row>
          <Col>
            <Button
              variant="warning"
              size="sm"
              disabled={decks[index].state !== 'stop'}
              onClick={() => {
                decks[index].state = 'fadeIn';
                dispatch({ type: ACTIONS.assignDeck, payload: { ...decks } });
              }}
            >
Play
            </Button>
          </Col>
          <Col>
            <Button
              variant="warning"
              size="sm"
              disabled={decks[index].state !== 'play'}
              onClick={() => {
                decks[index].state = 'fadeOut';
                dispatch({ type: ACTIONS.assignDeck, payload: { ...decks } });
              }}
            >
Stop
            </Button>
          </Col>
          <Col>
            <Badge variant={badgeState}>{decks[index].state}</Badge>
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert variant="success">
              {name.replace('.mp3', '')}
            </Alert>
          </Col>
          <Col>
            <Badge variant={(time.remain < 30 ? 'danger' : 'info')}>{time.remain}</Badge>
            <Badge variant="light">{time.current}</Badge>
            <Badge variant="dark">{time.duration}</Badge>
          </Col>
        </Row>
        <Row>
          <Col>Volume</Col>
          <Col>Fade In</Col>
          <Col>Fade Out</Col>
        </Row>
        <Row>
          <Col>{`${volume}%`}</Col>
          <Col>{`${fadeIn}s`}</Col>
          <Col>{`${fadeOut}s`}</Col>
        </Row>
      </Container>
    </Alert>
  );
};

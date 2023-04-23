import reactLogo from "./assets/react.svg";
import "./App.css";
import { useSpeechmaticsRt } from "./useSpeechmaticsRt";

function App() {
  const {
    isConnected,
    sessionEnd,
    sessionStart,
    partialTranscript,
    transcript,
  } = useSpeechmaticsRt({ jwt: smJwt });

  return (
    <div className="App">
      <div>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      {isConnected ? <div>Connected</div> : <div>Not Connected</div>}
      <button onClick={() => sessionStart?.()}>Start</button>
      <button onClick={() => sessionEnd?.()}>Stop</button>
      <div className="card">{transcript}</div>
      <div className="card">{partialTranscript}</div>
    </div>
  );
}

export default App;

const smJwt =
  "YOUR_JWT_HERE_WHICH_YOU_CAN_GET_FROM_THE_SPEECHMATICS_ENDPOINT_USING_YOUR_API_KEY";
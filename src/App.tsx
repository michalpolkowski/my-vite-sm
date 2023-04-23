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
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzbWlzc3VlciIsImV4cCI6MTY4MTk5OTgyMywibmJmIjoxNjgxOTkyNjIzLCJpYXQiOjE2ODE5OTYyMjMsImNvbnRyYWN0X2lkIjoiMTUiLCJwcm9kdWN0IjoicnQiLCJ1c2VyX2lkIjoic2VsZnNlcnZpY2UtMTQiLCJjb25uZWN0aW9uX3F1b3RhIjoiMiJ9.KPz0XTQSmgdNwY5bIBqBDAiErP784NYo50oLWrwyLe92kCZ_Tx_4co2wYb6sYrbhwAXeQGnEAxhd0msTYBpxnk4Xp4Iqw9H34fTZZj5ID7B7Nzm6v8fu8LCN3mtvjUlm4c-DnCApcjEj_kB_Yu4WpmUDOJtbLtL83sTYfNKu3h3h1S1MT15L7GTuc2LwkaICoVWK57kThtVkw6naxEj4mNUq1u2MJ_fnNepuCXAcaw1nER4XGsmPSiqwO5Mmb9WkRfIYVXEo1GmUBqJF3LCBjJ0OngJ2VdFr5_5RemPHdgYnsuL-w4jrHXq2KzXqM4InR-3heGNksIpxb0UkgLd70TSlnUQf_9D02oQJFTTb3aUwp8n9UpcXpoScuMriERwBNE8XkGGnw5ZPu7pWJ8LRh9MnbvJ5l1sqbl3yUVWM165zq7Atefg-QLXeb-V2U7seedKwCpRb_PhJHzbCzueAeDofv4qwY3IoxQfxOr53lrGDM4fb-p5O7bzJPryr9UYu";
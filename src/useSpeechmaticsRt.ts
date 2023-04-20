import { Speechmatics } from "@speechmatics/js-sdk/browser";
import { useEffect, useRef, useState } from "react";

export type UseSpeechmaticsRtParams = {
  setIsConnected?: (val: boolean) => void;
  setTranscript?: (val: string | ((val: string) => string)) => void;
  setPartialTranscript?: (val: string | ((val: string) => string)) => void;
  apiKey?: string;
  jwt?: string;
};

export function useSpeechmaticsRt({ apiKey, jwt }: UseSpeechmaticsRtParams) {
  const sm = useRef<Speechmatics>(new Speechmatics(apiKey));

  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");

  return {
    ...initialiseSM(
      sm.current,
      setIsConnected,
      setTranscript,
      setPartialTranscript,
      jwt
    ),
    isConnected,
    transcript,
    partialTranscript,
  };
}

function initialiseSM(
  sm: Speechmatics,
  setIsConnected?: (val: boolean) => void,
  setTranscript?: (val: string | ((val: string) => string)) => void,
  setPartialTranscript?: (val: string | ((val: string) => string)) => void,
  smJwt?: string
) {
  let session = sm.realtime.create(smJwt);

  let stream: MediaStream | null = null;
  let audioContext: AudioContext | null = null;
  let processor: ScriptProcessorNode | null = null;
  let source: MediaStreamAudioSourceNode | null = null;

  session.addListener("RecognitionStarted", () => {
    console.log("RecognitionStarted");
    setIsConnected?.(true);
  });

  session.addListener("EndOfTranscript", () => {
    setIsConnected?.(false);
  });

  session.addListener("AddTranscript", (result) => {
    console.log("AddTranscript", JSON.stringify(result, null, 2));
    setTranscript?.(
      (transcript) =>
        transcript +
        " " +
        result.results.map((r) => r.alternatives?.[0].content).join(" ")
    );
  });

  session.addListener("AddPartialTranscript", (result) => {
    console.log("AddPartialTranscript", JSON.stringify(result, null, 2));
    setPartialTranscript?.(
      (transcript) =>
        transcript +
        " " +
        result.results.map((r) => r.alternatives?.[0].content).join(" ")
    );
  });

  const sessionStart = async () => {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    processor = audioContext.createScriptProcessor(4096, 1, 1);
    source = audioContext.createMediaStreamSource(stream);
    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      const audioData = e.inputBuffer.getChannelData(0);
      if (session?.isConnected()) session?.sendAudio(audioData);
    };

    session?.start(
      { language: "en" },
      { sample_rate: 48000, encoding: "pcm_f32le", type: "raw" }
    );
  };

  const sessionEnd = () => {
    if (processor) {
      processor.onaudioprocess = null;
      processor.disconnect();
    }
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
    source?.disconnect();
    source = null;
    audioContext?.close();
    audioContext = null;
    session?.stop();
  };

  return { sessionStart, sessionEnd };
}

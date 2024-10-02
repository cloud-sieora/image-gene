import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, MicOff } from "@material-ui/icons";

const VoiceText = ({ isRecording, setTextImageSearch }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser does not support speech recognition");
      return;
    }

    if (isRecording) {
      // Start listening
      SpeechRecognition.startListening({ continuous: true });
    } else {
      // Stop listening when not recording
      SpeechRecognition.stopListening();
      resetTranscript()
    }
  }, [isRecording, browserSupportsSpeechRecognition]);

  console.log("transcript", transcript);

  // Whenever the transcript changes, update the search text
  useEffect(() => {
    setTextImageSearch(transcript);
  }, [transcript, setTextImageSearch]);


  useEffect(() =>{
    resetTranscript()
  },[])

  return (
    <div>
      {isRecording ? <Mic /> : <MicOff />}
    </div>
  );
};

export default VoiceText;

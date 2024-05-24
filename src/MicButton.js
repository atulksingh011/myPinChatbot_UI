import React, { useState, useEffect, useRef } from 'react';

const MicButton = ({ onChange }) => {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);
    const timeoutRef = useRef(null);
  
    useEffect(() => {
      if ('webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
  
        recognition.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            }
          }
          onChange(finalTranscript);
        };
  
        recognition.onend = () => {
          setIsRecording(false);
        };
  
        recognitionRef.current = recognition;
      }
    }, [onChange]);
  
    const handleMicClick = () => {
      if (isRecording) {
        recognitionRef.current.stop();
        clearTimeout(timeoutRef.current);
      } else {
        recognitionRef.current.start();
        timeoutRef.current = setTimeout(() => {
          recognitionRef.current.stop();
        }, 3000);
      }
      setIsRecording(!isRecording);
    };
  
    return (
      <button type="button" className={`btn ${isRecording ? 'btn-danger' : 'btn-secondary'}`} onClick={handleMicClick}>
        <i className="fas fa-microphone"></i>
      </button>
    );
  };
  
  export default MicButton;
import { Button, Input, Typography, Alert, Progress } from 'antd';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const generateRandomText = () => {
  const words = [
    'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'simple', 'test', 'speed',
    'accuracy', 'the', 'is', 'a', 'sentence', 'your', 'to', 'and', 'with', 'fast'
  ];
  const wordCount = 25;
  return Array.from({ length: wordCount }, () => words[Math.floor(Math.random() * words.length)]).join(' ') + '.';
};

const DashBoard = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const [inputText, setInputText] = useState('');
  const [sampleText, setSampleText] = useState(generateRandomText());
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!userData) {
      const stored = JSON.parse(localStorage.getItem("user_data"));
      if (stored?.user) {
        // Optional fallback, though AuthContext should handle this
        console.log("Fallback loaded user from localStorage:", stored.user);
      }
    }
  }, [userData]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!isTestActive) {
      setStartTime(Date.now());
      setIsTestActive(true);
    }

    setInputText(value);
    const progressValue = (value.length / sampleText.length) * 100;
    setProgress(Math.min(progressValue, 100));

    if (value === sampleText) {
      const endTime = Date.now();
      const timeInSeconds = (endTime - startTime) / 1000;
      const timeInMinutes = timeInSeconds / 60;
      const wordCount = sampleText.trim().split(/\s+/).length;
      const calculatedWpm = Math.round(wordCount / timeInMinutes);

      let correctChars = 0;
      for (let i = 0; i < sampleText.length; i++) {
        if (inputText[i] === sampleText[i]) correctChars++;
      }
      const calculatedAccuracy = Math.round((correctChars / sampleText.length) * 100);

      setWpm(calculatedWpm);
      setAccuracy(calculatedAccuracy);
      setTimeTaken(timeInSeconds.toFixed(2));
      setIsTestActive(false);
      setProgress(100);
    }
  };

  const resetTest = () => {
    setInputText('');
    setSampleText(generateRandomText());
    setStartTime(null);
    setWpm(null);
    setAccuracy(null);
    setTimeTaken(null);
    setIsTestActive(false);
    setError('');
    setProgress(0);
  };

  const getHighlightedText = () => {
    return sampleText.split('').map((char, index) => {
      let style = { color: 'black' };
      if (index < inputText.length) {
        style = inputText[index] === char
          ? { color: 'green', backgroundColor: '#e6ffe6', fontWeight: 'bold' }
          : { color: 'red', backgroundColor: '#ffe6e6', fontWeight: 'bold' };
      }
      return <span key={index} style={style}>{char}</span>;
    });
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && ['v', 'V'].includes(e.key)) {
      setError('Pasting is not allowed. Please type the text.');
      e.preventDefault();
    } else {
      setError('');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #b3e5fc, #e6f0fa)',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Navbar */}
      <div style={{
        backgroundColor: '#1e3a8a',
        color: '#ffffff',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          👋 <span style={{ fontSize: '20px' }}>Hello, {userData?.name || 'Loading...'}</span>
        </div>
        <Button type="primary" danger onClick={handleLogout}>Logout</Button>
      </div>

      {/* Main Content */}
      <div style={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          padding: '40px',
          borderRadius: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '500px'
        }}>
          {wpm === null && (
            <>
              <Title level={2} style={{ textAlign: 'center' }}>Typing Speed Test</Title>
              <Paragraph style={{ textAlign: 'center' }}>
                Type the following text as quickly and accurately as you can:
              </Paragraph>

              <Progress percent={progress} showInfo={false} strokeColor={{ from: '#3b82f6', to: '#60a5fa' }} style={{ marginBottom: '25px' }} />

              <Paragraph style={{
                backgroundColor: '#f9fafb',
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontFamily: 'Courier New, Courier, monospace',
                whiteSpace: 'pre-wrap',
                minHeight: '100px',
                overflowY: 'auto'
              }}>
                {getHighlightedText()}
              </Paragraph>
            </>
          )}

          <Input.TextArea
            aria-label="Typing area"
            rows={4}
            value={inputText}
            onChange={handleInputChange}
            onPaste={(e) => {
              e.preventDefault();
              setError('Pasting is not allowed. Please type the text.');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Start typing here..."
            disabled={wpm !== null}
            style={{ marginTop: '25px', borderRadius: '10px', fontSize: '16px', resize: 'none' }}
          />

          {error && <Alert message={error} type="error" showIcon style={{ marginTop: '25px' }} />}

          {wpm !== null && (
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <Title level={2}>Typing Test Complete</Title>
              <Title level={4}>Results</Title>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginBottom: '30px'
              }}>
                {[{ label: 'WPM', value: wpm }, { label: 'Accuracy', value: `${accuracy}%` }, { label: 'Time', value: `${timeTaken}s` }].map(({ label, value }) => (
                  <div key={label} style={{
                    background: '#f9fafb',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}>
                    <Text strong style={{ fontSize: '18px' }}>{label}</Text><br />
                    <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</Text>
                  </div>
                ))}
              </div>
              <Button type="primary" onClick={resetTest} style={{ padding: '12px 30px' }}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

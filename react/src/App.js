import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    padding: '30px',
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    borderRadius: '12px',
    border: '3px solid #00acc1',
    boxShadow: '0 4px 12px rgba(0, 172, 193, 0.2)',
    maxWidth: '100%',
    height: '100%',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(0, 172, 193, 0.3)',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    color: '#00838f',
    fontWeight: '700',
  },
  subtitle: {
    margin: 0,
    color: '#00695c',
    fontSize: '14px',
    fontWeight: '500',
  },
  info: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '25px',
    borderLeft: '4px solid #00acc1',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  infoItem: {
    padding: '8px 0',
    color: '#333',
    fontSize: '15px',
    lineHeight: '1.6',
  },
  messageFromHost: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '25px',
    border: '2px solid #4caf50',
  },
  messageTitle: {
    margin: '0 0 12px 0',
    color: '#2e7d32',
    fontSize: '18px',
    fontWeight: '600',
  },
  messageText: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#1b5e20',
  },
  inputSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '12px',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#00838f',
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  input: {
    flex: '1',
    minWidth: '250px',
    padding: '12px 16px',
    fontSize: '15px',
    borderRadius: '6px',
    border: '2px solid #00acc1',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    transition: 'all 0.3s ease',
  },
  button: {
    padding: '12px 28px',
    fontSize: '15px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #00acc1 0%, #00838f 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
};

function App({ onMessageSend }) {
  const [inputValue, setInputValue] = useState('');
  const [messageFromHost, setMessageFromHost] = useState('');

  useEffect(() => {
    // Listen for messages from Angular host
    const handleHostMessage = (event) => {
      if (event.detail) {
        setMessageFromHost(event.detail);
        console.log('✅ React received from Host:', event.detail);
      }
    };

    window.addEventListener('hostToReact', handleHostMessage);

    return () => {
      window.removeEventListener('hostToReact', handleHostMessage);
    };
  }, []);

  const handleSend = () => {
    if (onMessageSend && inputValue.trim()) {
      onMessageSend(inputValue);
      setInputValue('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>⚛️ React Remote Component</h2>
        <p style={styles.subtitle}>Loaded via Module Federation from port 3000</p>
      </div>

      <div style={styles.info}>
        <div style={styles.infoItem}>
          <strong style={{ color: '#00838f', fontWeight: '600' }}>Running on:</strong> Port 3000
        </div>
        <div style={styles.infoItem}>
          <strong style={{ color: '#00838f', fontWeight: '600' }}>Loaded by:</strong> Angular Host on Port 4200
        </div>
        <div style={styles.infoItem}>
          <strong style={{ color: '#00838f', fontWeight: '600' }}>Technology:</strong> Webpack Module Federation
        </div>
      </div>
      
      {messageFromHost && (
        <div style={styles.messageFromHost}>
          <h3 style={styles.messageTitle}>📥 Message from Host:</h3>
          <p style={styles.messageText}>{messageFromHost}</p>
        </div>
      )}
      
      <div style={styles.inputSection}>
        <label style={styles.label}>📤 Send Message to Angular Host</label>
        <div style={styles.inputGroup}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type message for Angular Host..."
            style={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            style={styles.button}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #00838f 0%, #006064 100%)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #00acc1 0%, #00838f 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            }}
          >
            Send to Host
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

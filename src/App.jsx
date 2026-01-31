import { useState } from 'react'
import './App.css'

const PROVIDERS = {
  openai: {
    name: 'OpenAI',
    placeholder: 'sk-...',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini'
  },
  anthropic: {
    name: 'Anthropic',
    placeholder: 'sk-ant-...',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-5-sonnet-20241022'
  },
  google: {
    name: 'Google AI',
    placeholder: 'AIza...',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash'
  }
}

function App() {
  const [apiKey, setApiKey] = useState('')
  const [provider, setProvider] = useState('openai')
  const [isConfigured, setIsConfigured] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConfigure = (e) => {
    e.preventDefault()
    if (apiKey.trim()) {
      setIsConfigured(true)
      setError('')
    }
  }

  const handleReset = () => {
    setIsConfigured(false)
    setApiKey('')
    setMessages([])
    setInput('')
    setError('')
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError('')

    try {
      const response = await callAI([...messages, userMessage])
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setError(err.message || 'Failed to get response')
    } finally {
      setIsLoading(false)
    }
  }

  const callAI = async (messageHistory) => {
    const config = PROVIDERS[provider]

    if (provider === 'openai') {
      const res = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: messageHistory.map(m => ({ role: m.role, content: m.content }))
        })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error?.message || `API error: ${res.status}`)
      }
      const data = await res.json()
      return data.choices[0].message.content
    }

    if (provider === 'anthropic') {
      const res = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: 4096,
          messages: messageHistory.map(m => ({ role: m.role, content: m.content }))
        })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error?.message || `API error: ${res.status}`)
      }
      const data = await res.json()
      return data.content[0].text
    }

    if (provider === 'google') {
      const url = `${config.endpoint}?key=${apiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messageHistory.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error?.message || `API error: ${res.status}`)
      }
      const data = await res.json()
      return data.candidates[0].content.parts[0].text
    }
  }

  if (!isConfigured) {
    return (
      <div className="setup-container">
        <div className="setup-card">
          <h1>Simple AI Chat</h1>
          <p className="subtitle">Enter your API key to start chatting</p>

          <form onSubmit={handleConfigure}>
            <div className="form-group">
              <label>Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                {Object.entries(PROVIDERS).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={PROVIDERS[provider].placeholder}
                autoFocus
              />
            </div>

            <button type="submit" disabled={!apiKey.trim()}>
              Start Chatting
            </button>
          </form>

          <p className="note">
            Your API key is stored only in memory and will be cleared when you refresh the page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Simple AI Chat</h1>
        <div className="header-info">
          <span className="provider-badge">{PROVIDERS[provider].name}</span>
          <button className="reset-btn" onClick={handleReset}>Reset</button>
        </div>
      </header>

      <div className="messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Start a conversation by typing a message below.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        {error && (
          <div className="error-message">{error}</div>
        )}
      </div>

      <form className="input-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          autoFocus
        />
        <button type="submit" disabled={!input.trim() || isLoading}>
          Send
        </button>
      </form>
    </div>
  )
}

export default App

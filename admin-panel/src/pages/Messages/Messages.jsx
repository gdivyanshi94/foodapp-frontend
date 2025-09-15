import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import './Messages.css'
import { config } from '../../services/config'
import axios from 'axios'

// For consistent experience, use HTTP polling for admin panel too
let messagePollingInterval = null

function Messages() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  // Fetch messages from server
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${config.serverBaseUrl}/chat/messages`)
      if (response.data && response.data.status === 'success') {
        setMessages(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchMessages()
    
    // Poll for new messages every 2 seconds
    messagePollingInterval = setInterval(fetchMessages, 2000)

    // cleanup function
    return () => {
      if (messagePollingInterval) {
        clearInterval(messagePollingInterval)
      }
    }
  }, [])

  const onSendMessage = async () => {
    console.log('Sending message:', message)
    if (message.length == 0) {
      toast.error('Message cannot be empty')
    } else {
      try {
        const messageData = {
          sender: sessionStorage.getItem('name') || 'Admin',
          text: message,
          timestamp: new Date(),
        }
        
        const response = await axios.post(`${config.serverBaseUrl}/chat/messages`, messageData)
        
        if (response.data && response.data.status === 'success') {
          setMessage('') // clear the input field after sending
          fetchMessages() // Immediately fetch updated messages
        } else {
          toast.error('Failed to send message')
        }
      } catch (error) {
        console.error('Error sending message:', error)
        toast.error('Failed to send message')
      }
    }
  }

  return (
    <div className='container'>
      <h2 className='page-header'>Messages</h2>
      <div className='messages-list'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              'message-item ' +
              (message.sender === sessionStorage.getItem('name')
                ? 'message-item-sender'
                : '')
            }
          >
            <div>
              <strong>{message.sender}</strong>: {message.text}
            </div>
            <small>{new Date(message.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className='mt-3'>
        <div className='input-group mb-3'>
          <input
            onChange={(e) => setMessage(e.target.value)}
            type='text'
            className='form-control'
            placeholder='your message here'
            value={message}
          />
          <button
            onClick={onSendMessage}
            className='btn btn-outline-primary'
            type='button'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Messages

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
// import { io } from 'socket.io-client' // Uncomment for Socket.IO
import './Messages.css'
import { config } from '../../services/config'
import axios from 'axios'

// SOCKET.IO APPROACH (Commented out - can work with admin panel since it's HTTP)
/*
const socket = io('http://3.109.184.36:6001', {
  path: '/socket.io',
  transports: ['polling', 'websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
})
*/

// REST API APPROACH (Current implementation)
let messagePollingInterval = null

function Messages() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  /* SOCKET.IO APPROACH (Commented out - uncomment when ready)
  useEffect(() => {
    // Connection event listeners
    socket.on('connect', () => {
      console.log('Admin panel connected to Socket.IO server')
    })

    socket.on('connect_error', (error) => {
      console.error('Admin panel connection error:', error)
    })

    socket.on('disconnect', (reason) => {
      console.log('Admin panel disconnected:', reason)
    })

    // Listen for new messages
    socket.on('message', (data) => {
      console.log('New message received:', data)
      setMessages(prevMessages => [...prevMessages, data])
    })

    // Listen for initial messages
    socket.on('initialMessages', (data) => {
      console.log('Initial messages received:', data)
      if (Array.isArray(data)) {
        setMessages(data)
      }
    })

    // Cleanup
    return () => {
      socket.off('connect')
      socket.off('connect_error')
      socket.off('disconnect')
      socket.off('message')
      socket.off('initialMessages')
    }
  }, [])
  */

  // REST API APPROACH (Current implementation)
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

  /* SOCKET.IO SEND MESSAGE (Commented out)
  const onSendMessage = () => {
    console.log('Sending message:', message)
    if (message.length == 0) {
      toast.error('Message cannot be empty')
    } else {
      if (socket.connected) {
        socket.emit('sendMessage', {
          sender: sessionStorage.getItem('name') || 'Admin',
          text: message,
          timestamp: new Date(),
        })
        setMessage('')
      } else {
        console.error('Socket is not connected')
        toast.error('Connection error. Please refresh the page.')
      }
    }
  }
  */

  // REST API SEND MESSAGE (Current implementation)
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

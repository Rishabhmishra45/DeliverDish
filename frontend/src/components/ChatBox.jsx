// frontend/src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react'
import { IoSend } from 'react-icons/io5'
import { BsChatDots } from 'react-icons/bs'
import useChat from '../hooks/useChat'

const ChatBox = ({ orderId, shopOrderId, role, status, partnerName }) => {

  const { messages, loading, locked, sendMessage, currentUserId } = useChat(orderId, shopOrderId, status)
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, open])

  // delivered ho chuka -> chat component hi render mat karo
  if (locked) return null

  const handleSend = () => {
    if (!text.trim()) return
    sendMessage(text, role)
    setText("")
  }

  return (
    <div className='w-full mt-4'>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className='w-full flex items-center justify-between gap-2 bg-orange-50 hover:bg-orange-100 transition-colors duration-200 border border-orange-100 rounded-xl px-4 py-3'
      >
        <span className='flex items-center gap-2 text-sm sm:text-base font-medium text-[#ff4d2d]'>
          <BsChatDots size={18} />
          Chat {partnerName ? `with ${partnerName}` : ""}
        </span>
        <span className='text-xs sm:text-sm text-gray-400'>{open ? "Hide" : "Open"}</span>
      </button>

      {open &&
        <div className='mt-2 flex flex-col border border-orange-100 rounded-xl bg-white overflow-hidden'>

          {/* Messages */}
          <div className='flex-1 h-[240px] sm:h-[300px] overflow-y-auto px-3 py-3 flex flex-col gap-2 bg-[#fff9f6]'>
            {loading &&
              <p className='text-xs sm:text-sm text-gray-400 text-center mt-4'>Loading chat...</p>
            }

            {!loading && messages.length === 0 &&
              <p className='text-xs sm:text-sm text-gray-400 text-center mt-4'>
                No messages yet. Say hi!
              </p>
            }

            {messages.map((msg) => {
              const isMine = msg.sender === currentUserId
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[75%] break-words text-xs sm:text-sm ${
                      isMine
                        ? "bg-[#ff4d2d] text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className='flex items-center gap-2 border-t border-orange-100 px-2 sm:px-3 py-2 bg-white'>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder='Type a message...'
              maxLength={500}
              className='flex-1 min-w-0 border border-gray-200 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm outline-none focus:border-[#ff4d2d]'
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className='flex-shrink-0 bg-[#ff4d2d] text-white p-2.5 sm:p-3 rounded-full hover:bg-orange-600 transition-colors duration-200 disabled:opacity-40'
            >
              <IoSend size={16} />
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default ChatBox
"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useMessagingContract, useUserConversations, useUnreadCount } from "@/utils/useMessagingContract"
import { Send, MessageCircle, Loader } from "lucide-react"

export default function MessagingComponent() {
  const { isConnected, address } = useAccount()
  const { sendMessage, isPending } = useMessagingContract()
  const { conversationIds } = useUserConversations(address || "")
  const { unreadCount } = useUnreadCount(address || "")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [messages, setMessages] = useState<Array<{ id: string; sender: string; content: string; timestamp: number }>>([])

  const handleSendMessage = async () => {
    if (!recipientAddress || !messageContent) return

    try {
      sendMessage(recipientAddress, messageContent)
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          sender: address || "",
          content: messageContent,
          timestamp: Date.now(),
        },
      ])
      setMessageContent("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  if (!isConnected) {
    return (
      <div className="w-full bg-blue-50 rounded-lg p-8 text-center">
        <p className="text-blue-800 font-semibold">Please connect your wallet to use messaging</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <MessageCircle size={32} />
          Decentralized Messaging
        </h2>
        {unreadCount > 0 && (
          <div className="bg-red-500 text-white rounded-full px-3 py-1 font-semibold">{unreadCount} unread</div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Conversations</p>
          <p className="text-2xl font-bold">{conversationIds.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Unread</p>
          <p className="text-2xl font-bold">{unreadCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="text-2xl font-bold text-green-600">Active</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 max-h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${msg.sender === address ? "bg-blue-100 ml-auto" : "bg-gray-200"} max-w-xs`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-gray-600 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
          />
          <p className="text-xs text-gray-600 mt-1">{messageContent.length}/1000 characters</p>
        </div>

        <button
          onClick={handleSendMessage}
          disabled={isPending || !recipientAddress || !messageContent}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader size={20} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={20} />
              Send Message
            </>
          )}
        </button>
      </div>
    </div>
  )
}

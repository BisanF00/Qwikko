import React, { useEffect, useState } from "react";
import { fetchConversations, fetchMessages, sendMessage } from "../VendorAPI2";
import { getUserIdFromToken } from "./auth";

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const currentUserId = getUserIdFromToken();
  console.log("Current user ID:", currentUserId);

  // تحميل المحادثات عند فتح الصفحة
  useEffect(() => {
    const loadConversations = async () => {
      const data = await fetchConversations();
      setConversations(data);
    };
    loadConversations();
  }, []);

  // تحديد مستخدم من المحادثات
  const handleSelectUser = async (conversation) => {
    if (!conversation) return;

    const { sender_id, receiver_id } = conversation;

    // تحديد الطرف الآخر
    const otherUserId = sender_id === currentUserId ? receiver_id : sender_id;
    console.log("Selected user:", otherUserId);
    setSelectedUser(otherUserId);

    const msgs = await fetchMessages(otherUserId);
    setMessages(msgs);
  };

  // إرسال رسالة
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const msg = await sendMessage(selectedUser, newMessage);
    if (msg) {
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* العمود الأيسر - قائمة المحادثات */}
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Chats</h2>
        <ul>
          {conversations.map((conv, idx) => {
            const otherUserId =
              conv.sender_id === currentUserId ? conv.receiver_id : conv.sender_id;
            const name =
              conv.sender_id === currentUserId ? conv.receiver_name : conv.sender_name;

            return (
              <li
                key={conv.id || idx}
                className={`p-2 cursor-pointer rounded ${
                  selectedUser === otherUserId ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
                onClick={() => handleSelectUser(conv)}
              >
                {name}
              </li>
            );
          })}
        </ul>
      </div>

      {/* العمود الأيمن - المحادثة المفتوحة */}
      <div className="w-2/3 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 && selectedUser && (
            <div className="text-gray-500 text-center mt-4">
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded max-w-xs ${
                msg.sender_id === currentUserId
                  ? "bg-green-200 ml-auto text-right"
                  : "bg-gray-200 mr-auto text-left"
              }`}
            >
              {msg.message}
              <div className="text-xs text-gray-500">
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        {selectedUser ? (
          <div className="p-4 border-t flex">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        ) : (
          <div className="p-4 text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

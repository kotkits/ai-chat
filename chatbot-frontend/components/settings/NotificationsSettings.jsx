import { useState, useEffect } from 'react';

export default function NotificationsSettings() {
  const [liveChatDesktop, setLiveChatDesktop] = useState({
    newMessageAssigned: false,
    newConversationUnassigned: false,
    conversationAssigned: false,
  });
  const [liveChatChannel, setLiveChatChannel] = useState({
    conversationAssigned: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/notifications')
      .then(res => res.json())
      .then(data => {
        setLiveChatDesktop(data.liveChatDesktop);
        setLiveChatChannel(data.liveChatChannel);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleDesktop = field =>
    setLiveChatDesktop(prev => ({ ...prev, [field]: !prev[field] }));
  const toggleChannel = field =>
    setLiveChatChannel(prev => ({ ...prev, [field]: !prev[field] }));

  const save = async () => {
    setLoading(true);
    await fetch('/api/settings/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liveChatDesktop, liveChatChannel }),
    });
    alert('Notifications settings saved!');
    setLoading(false);
  };

  if (loading) return <p>Loading notifications…</p>;

  return (
    <div className="space-y-8">
      {/* Desktop Notifications */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Live Chat Desktop Notifications</h3>
        <div className="grid grid-cols-2 gap-6 items-start">
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={liveChatDesktop.newMessageAssigned}
                onChange={() => toggleDesktop('newMessageAssigned')}
                className="mr-2"
              />
              I get a new message from a conversation assigned to me
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={liveChatDesktop.newConversationUnassigned}
                onChange={() => toggleDesktop('newConversationUnassigned')}
                className="mr-2"
              />
              There is a new conversation in unassigned folder
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={liveChatDesktop.conversationAssigned}
                onChange={() => toggleDesktop('conversationAssigned')}
                className="mr-2"
              />
              A conversation is assigned to me
            </label>
          </div>
          <p className="text-gray-500 text-sm">
            Enable instant popup notifications on your desktop about new messages and assigned conversations. 
            If you don’t see the notifications, check your system settings to ensure notifications are enabled.
          </p>
        </div>
      </div>

      {/* Channel Notifications */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Live Chat Channel Notifications</h3>
        <div className="grid grid-cols-2 gap-6 items-start">
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={liveChatChannel.conversationAssigned}
                onChange={() => toggleChannel('conversationAssigned')}
                className="mr-2"
              />
              A conversation is assigned to me
            </label>
          </div>
          <p className="text-gray-500 text-sm">
            Live Chat notifications help you support your audience and track leads in channels connected below.
          </p>
        </div>
      </div>

      <button
        onClick={save}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Save Notifications
      </button>
    </div>
  );
}

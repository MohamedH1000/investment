import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function SendEmails() {
  const [contacts, setContacts] = useState([]);
  const [promotionalContent, setPromotionalContent] = useState("");
  const [status, setStatus] = useState({ sent: 0, failed: 0, total: 0 });
  const [isSending, setIsSending] = useState(false);
  //   console.log([contacts]);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setContacts(data);
        setStatus({ sent: 0, failed: 0, total: data.length });
      } catch (error) {
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  };

  const sendEmails = async () => {
    setIsSending(true);
    let sentCount = 0;
    let failedCount = 0;

    for (const contact of contacts) {
      try {
        const { error } = await supabase.functions.invoke("send-promotional", {
          body: {
            email: contact.email,
            subscriberName: contact.fullName,
            promotionalContent,
            isPromotionalEmail: true,
          },
        });

        if (error) throw error;
        sentCount++;
      } catch (error) {
        console.error(`Failed to send to ${contact.email}:`, error);
        failedCount++;
      }

      setStatus({
        sent: sentCount,
        failed: failedCount,
        total: contacts.length,
      });
    }

    setIsSending(false);
    alert(`Emails sent: ${sentCount} | Failed: ${failedCount}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Send Promotional Emails</h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Upload Contacts JSON:
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full mt-1"
          />
        </label>
        {contacts.length > 0 && (
          <p className="text-sm text-gray-600">
            Loaded {contacts.length} contacts
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Email Content (HTML):
          <textarea
            value={promotionalContent}
            onChange={(e) => setPromotionalContent(e.target.value)}
            rows={10}
            className="w-full p-3 border rounded mt-1 font-mono"
          />
        </label>
      </div>

      <button
        onClick={sendEmails}
        disabled={isSending || contacts.length === 0}
        className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50"
      >
        {isSending ? "Sending..." : "Send Emails"}
      </button>

      {isSending && (
        <div className="mt-6">
          <p>
            Progress: {status.sent + status.failed} of {status.total}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${
                  ((status.sent + status.failed) / status.total) * 100
                }%`,
              }}
            ></div>
          </div>
          <p className="mt-2">
            ✅ Sent: {status.sent} | ❌ Failed: {status.failed}
          </p>
        </div>
      )}
    </div>
  );
}

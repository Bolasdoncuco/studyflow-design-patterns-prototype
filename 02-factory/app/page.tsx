"use client";

import { useState } from "react";

type Result = { channel: string; deliveredTo: string; detail: string };

export default function Home() {
  const [type, setType] = useState<"email" | "sms" | "push" | "guasap">("email");
  const [to, setTo] = useState("student@school.edu");
  const [message, setMessage] = useState("Your grade is now available.");
  const [log, setLog] = useState<Result[]>([]);

  async function handleSend() {
    const res = await fetch("/api/factory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, to, message }),
    });
    const data = await res.json();
    if (data.ok) setLog((prev) => [data.result, ...prev]);
  }

  return (
    <main className="container">
      <h1>🏭 Factory Pattern — Notifications</h1>
      <p className="subtitle">
        This page never creates <code>new EmailNotifier()</code>,{" "}
        <code>new SmsNotifier()</code>, or <code>new PushNotifier()</code>. It
        just asks <code>NotifierFactory</code> for the desired channel.
      </p>

      <div className="panel">
        <select value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
          <option value="guasap">Guasap</option>
        </select>
        <input value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} />
      <button onClick={handleSend}>Send notification</button>

      <div className="results">
        {log.length === 0 && <p className="empty">No notifications sent yet.</p>}
        {log.map((r, i) => (
          <div className={`card canal-${r.channel}`} key={i}>
            <p className="tag">{r.channel.toUpperCase()}</p>
            <p>{r.detail}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

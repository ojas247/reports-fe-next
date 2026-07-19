import { useRef, useState } from "react";
import { v0_8 } from "@a2ui/lit";
import * as UI from "@a2ui/lit/ui";

export default function Test() {
  const processorRef = useRef(v0_8.Data.createSignalA2uiMessageProcessor());

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [surfaces, setSurfaces] = useState(new Map());

  const serverUrl = "http://localhost:8080/Test"; // change to your agent server

  async function sendMessage() {
    if (!input) return;

    setLoading(true);

    try {
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAction: {
            name: "user_message",
            timestamp: new Date().toISOString(),
            context: { text: input },
          },
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");

        // keep incomplete line in buffer
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          const msg = JSON.parse(trimmed);
          console.log("Parsed message:", msg);
          processorRef.current.processMessages([msg]);
        }
      }

      setSurfaces(new Map(processorRef.current.getSurfaces()));
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  function renderNode(node) {
    if (!node) return null;

    switch (node.type) {
      case "Text":
        return <p key={node.id}>{node.properties.text}</p>;

      case "Button":
        return (
          <button key={node.id}>
            {node.properties.label || "Button"}
          </button>
        );

      case "Column":
        return (
          <div key={node.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {node.properties.children?.map((child, index) => (
              <div key={child?.id ?? `col-${index}`} style={{ display: "contents" }}>
                {renderNode(child)}
              </div>
            ))}
          </div>
        );

      case "Row":
        return (
          <div key={node.id} style={{ display: "flex", gap: 10 }}>
            {node.properties.children?.map((child, index) => (
              <div key={child?.id ?? `row-${index}`} style={{ display: "contents" }}>
                {renderNode(child)}
              </div>
            ))}
          </div>
        );

      case "Image":
        return (
          <img
            key={node.id}
            src={node.properties.src}
            alt=""
            style={{ maxWidth: "100%" }}
          />
        );

      default:
        return <div key={node.id}>Unsupported component: {node.type}</div>;
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>A2UI Test Page</h1>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={{ flex: 1, padding: 10 }}
        />

        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Loading..." : "Send"}
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        {[...surfaces.entries()].map(([surfaceId, surface], index) => (
          <div key={surfaceId ?? `surface-${index}`}>
            {renderNode(surface.componentTree)}
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useRef } from "react";

interface WithMemoProps {
  language: string;
}

function WithMemo(props: WithMemoProps) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  renderCountRef.current += 1;
  lastRenderTimeRef.current = Date.now();

  return (
    <div className="correct__usage">
      <h3>✅ With React.memo</h3>
      <p>
        <strong>Language:</strong> {props.language}
      </p>
      <p>
        <strong>Render Count:</strong> {renderCountRef.current}
      </p>
      <p>
        <strong>Last Render:</strong>{" "}
        {new Date(lastRenderTimeRef.current).toLocaleTimeString()}
      </p>
      <div className="info">✨ Only re-renders when language changes</div>
    </div>
  );
}

export default React.memo(WithMemo);

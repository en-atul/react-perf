import React, { useRef } from "react";

interface LanguageProfile {
  language: string;
  meta: {
    timestamp: string;
  };
}

interface WithoutNestedMemoProps {
  data: LanguageProfile;
}

function WithoutNestedMemo(props: WithoutNestedMemoProps) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  renderCountRef.current += 1;
  lastRenderTimeRef.current = Date.now();

  return (
    <div className="wrong__usage">
      <h3>❌ Without React.memo</h3>
      <p>
        <strong>Language:</strong> {props.data.language}
      </p>
      <p>
        <strong>Meta timestamp:</strong> {props.data.meta.timestamp}
      </p>
      <p>
        <strong>Render Count:</strong> {renderCountRef.current}
      </p>
      <p>
        <strong>Last Render:</strong>{" "}
        {new Date(lastRenderTimeRef.current).toLocaleTimeString()}
      </p>
      <div className="info">⚠️ Re-renders on every parent update</div>
    </div>
  );
}

export default React.memo(WithoutNestedMemo);

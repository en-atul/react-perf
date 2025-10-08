import React, { useRef } from "react";

interface LanguageProfile {
  language: string;
  meta: {
    timestamp: string;
  };
}

interface WithNestedMemoProps {
  data: LanguageProfile;
}

function WithNestedMemo(props: WithNestedMemoProps) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  renderCountRef.current += 1;
  lastRenderTimeRef.current = Date.now();

  return (
    <div className="correct__usage">
      <h3>✅ With React.memo</h3>
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
      <div className="info">✨ Only re-renders when language changes</div>
    </div>
  );
}


/**
 * [Important]: Easy to make mistake here!
 * 
 * return true if you want to skip re-render
 * return false if you want to re-render
 */
export default React.memo(
  WithNestedMemo,
  (prev, next) => {
    const languageChanged = prev.data.language !== next.data.language;
    const timestampChanged = prev.data.meta.timestamp !== next.data.meta.timestamp;

    return !(languageChanged || timestampChanged);
  }
);



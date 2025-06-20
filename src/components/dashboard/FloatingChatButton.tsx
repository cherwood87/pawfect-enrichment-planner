import React from "react";
import CoachButton from "@/components/chat/CoachButton";

interface FloatingChatButtonProps {
  onChatOpen: () => void;
}

const FloatingChatButton = (props) => {
  console.log("[FloatingChatButton] Rendering");
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <CoachButton onClick={props.onChatOpen} />
    </div>
  );
};

export default FloatingChatButton;

import { Loader2, MessageCircle, Send } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/contexts/ChatContext";

interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
	activities?: any[];
}

interface ActivityHelpContext {
	type: "activity-help";
	activityName: string;
	activityPillar: string;
	activityDifficulty: string;
	activityDuration: number;
}

interface ChatModalProps {
	isOpen: boolean;
	onClose: () => void;
	chatContext?: ActivityHelpContext;
}

function stripJsonBlocks(text: string): string {
	return text
		.replace(
			/(\{[\s\S]*?"title":\s*".+?[\s\S]*?"energyLevel":\s*".+?"[\s\S]*?\})/g,
			"",
		)
		.replace(/\*\*(.*?)\*\*/g, "$1")
		.replace(/\*(.*?)\*/g, "$1")
		.replace(/^#+\s*/gm, "")
		.trim();
}

const ChatModal: React.FC<ChatModalProps> = ({
	isOpen,
	onClose,
	chatContext,
}) => {
	const [input, setInput] = useState("");
	const { currentConversation, isLoading, sendMessage } = useChat();
	const inputRef = useRef<HTMLInputElement>(null);

	// Send initial message with activity context when modal opens
	useEffect(() => {
		if (
			isOpen &&
			chatContext &&
			currentConversation &&
			currentConversation.messages.length === 0
		) {
			const initialMessage = `I need help with the "${chatContext.activityName}" activity. It's a ${chatContext.activityDifficulty} difficulty ${chatContext.activityPillar} activity that takes ${chatContext.activityDuration} minutes. Can you give me some tips and guidance?`;

			// Send the message with activity context
			sendMessage(initialMessage, chatContext);
		}
	}, [isOpen, chatContext, currentConversation, sendMessage]);

	const handleSend = async () => {
		if (!input.trim() || isLoading) return;
		const messageContent = input.trim();
		setInput("");
		try {
			await sendMessage(messageContent, chatContext);
		} catch (error) {
			console.error("Send message failed:", error);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	useEffect(() => {
		if (isOpen && inputRef.current) {
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [isOpen]);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
				<DialogHeader className="p-4 pb-0">
					<DialogTitle className="flex items-center space-x-2">
						<MessageCircle className="w-5 h-5 text-blue-500" />
						<span>
							{chatContext ? `Help with ${chatContext.activityName}` : "Chat"}
						</span>
					</DialogTitle>
				</DialogHeader>

				<div className="flex-1 flex flex-col min-h-0">
					<ScrollArea className="flex-1 p-4">
						<div className="space-y-4">
							{currentConversation?.messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`max-w-[80%] p-3 rounded-lg ${
											message.role === "user"
												? "bg-blue-500 text-white rounded-br-sm"
												: "bg-gray-100 text-gray-800 rounded-bl-sm"
										}`}
									>
										<p className="text-sm whitespace-pre-wrap">
											{message.role === "assistant"
												? stripJsonBlocks(message.content)
												: message.content}
										</p>
									</div>
								</div>
							))}

							{isLoading && (
								<div className="flex justify-start">
									<div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-sm p-3">
										<div className="flex items-center space-x-2">
											<Loader2 className="w-4 h-4 animate-spin" />
											<span className="text-sm">Thinking...</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</ScrollArea>

					<div className="p-4 border-t">
						<div className="flex space-x-2">
							<Input
								ref={inputRef}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Ask your question..."
								disabled={isLoading}
								className="flex-1"
							/>
							<Button
								onClick={handleSend}
								disabled={!input.trim() || isLoading}
								size="icon"
							>
								{isLoading ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Send className="w-4 h-4" />
								)}
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ChatModal;

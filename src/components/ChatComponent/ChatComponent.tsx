import { useEffect, useRef, useState } from "react";
import Groq from "groq-sdk";
import MessageInput from "../MessageInput/MessageInput";
import { PulseLoader } from "react-spinners";
import classNames from "classnames";
import { Col, Row } from "reactstrap";
import { Face, SmartToyOutlined } from "@mui/icons-material";
import styles from "./ChatComponent.module.scss";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Set this to true
});

interface ChatComponentProps {
  hideTypeWriter: (flag: boolean) => void;
}

const ChatComponent = (props: ChatComponentProps) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [responseLoading, setResponseLoading] = useState<boolean>(false);
  const [isAnimation, setIsAnimation] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      props.hideTypeWriter(true);
      setIsAnimation(true);
    } else {
      props.hideTypeWriter(false);
    }
  }, [messages]);

  // Scroll to the bottom when messages or loading state update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, responseLoading]);

  const onSubmit = async (queryText: string) => {
    if (queryText.trim() === "") return;

    const newMessage = { role: "user", content: queryText };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setResponseLoading(true);

    try {
      // @ts-ignore
      const chatCompletion = await groq.chat.completions.create({
        messages: [...messages, newMessage],
        model: "llama3-8b-8192",
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null,
      });

      let aiContent = "";
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || "";
        aiContent += content;
      }
      const newAiMessage = {
        role: "assistant",
        content: aiContent,
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error("Error fetching chat completion:", error);
    } finally {
      setResponseLoading(false);
    }
  };

  const convertStarToStrong = (inputString:string) => {
    return inputString.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  }

  return (
    <div className={classNames("my-3", styles.chat_container)}>
      {messages.map((msg, index) => (
        <Row key={index} className="my-4 mx-4">
          {msg.role === "user" && <Col md={2}></Col>}
          <Col md={10} key={index} className={msg.role}>
            {msg.role === "user" ? (
              <Face className={styles.chat_container_mr_8} />
            ) : (
              <SmartToyOutlined className={styles.chat_container_mr_8} />
            )}
            <span
              dangerouslySetInnerHTML={{
                __html: convertStarToStrong(msg.content),
              }}
            />
          </Col>
          {msg.role === "assistant" && <Col md={2}></Col>}
        </Row>
      ))}
      <PulseLoader
        className={classNames("my-3", styles.chat_container_ml_35)}
        loading={responseLoading}
        size={10}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <div ref={bottomRef} />
      <div className={classNames("my-3", isAnimation ? "" : "")}>
        <MessageInput onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default ChatComponent;

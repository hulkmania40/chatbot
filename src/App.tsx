import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import classNames from "classnames";
import { Container } from "reactstrap";
import "./App.css";
import ChatComponent from "./components/ChatComponent/ChatComponent";
import ReactGA from 'react-ga';

const TRACKING_ID = "G-V5M2QYMX0S";
ReactGA.initialize(TRACKING_ID);

const App: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);

  useEffect(() => {
    if(!showTypewriter){
      triggerAnimation();
    }
  }, [showTypewriter]);
  

  const triggerAnimation = () => {
    if (!isAnimating) {
      setIsAnimating(true);
    }
  };

  return (
    <Container>
      <div style={{ maxWidth: "90%", margin: "auto", padding: "20px" }}>
        <div className="my-3">
          {showTypewriter && (
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    "<strong>Please type in your query below: </strong>"
                  )
                  .pauseFor(2500)
                  .start();
              }}
            />
          )}
        </div>
        <div className={classNames(`${isAnimating ? "" : ""}`)}>
          <ChatComponent
            hideTypeWriter={(flag: boolean) => {
              setShowTypewriter(!flag);
            }}
          />{" "}
        </div>
      </div>
    </Container>
  );
};

export default App;

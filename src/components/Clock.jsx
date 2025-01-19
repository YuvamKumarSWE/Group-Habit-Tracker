import React, { useEffect, useRef } from "react";
import "./clock.css";

const Clock = () => {
  const hrRef = useRef(null);
  const mnRef = useRef(null);
  const scRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const day = new Date();
      const hh = day.getHours() * 30;
      const mm = day.getMinutes() * 6;
      const ss = day.getSeconds() * 6;

      if (hrRef.current) hrRef.current.style.transform = `rotateZ(${hh + mm / 12}deg)`;
      if (mnRef.current) mnRef.current.style.transform = `rotateZ(${mm}deg)`;
      if (scRef.current) scRef.current.style.transform = `rotateZ(${ss}deg)`;
    };

    const intervalId = setInterval(updateClock, 1000);
    updateClock(); // Call once immediately to set the initial state.

    return () => clearInterval(intervalId); // Cleanup interval on component unmount.
  }, []);

  return (
    <div className="clock">
      <div className="numbers">
        <span style={{ "--i": 0 }}><b>12</b></span>
        <span style={{ "--i": 1 }}><b>3</b></span>
        <span style={{ "--i": 2 }}><b>6</b></span>
        <span style={{ "--i": 3 }}><b>9</b></span>
        <div className="circle" id="hr" ref={hrRef}>
          <i></i>
        </div>
        <div className="circle" id="mn" ref={mnRef}>
          <i></i>
        </div>
        <div className="circle" id="sc" ref={scRef}>
          <i></i>
        </div>
      </div>
    </div>
  );
};

export default Clock;

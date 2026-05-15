/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import styles from "./NumberRibbon.module.css";
import moment from "moment";
import { times } from "@/lib/times";

const sumOfDigits = (number: number) => {
  let sum = 0;
  while (number > 0) {
    sum += number % 10;
    number = Math.floor(number / 10);
  }
  return sum;
};

interface NumberRibbonProps {
  logos: any[];
  rollingComplete?: boolean;
  currentResultTime?: string;
}

const NumberRibbon = ({
  logos,
  rollingComplete = true,
  currentResultTime = ""
}: NumberRibbonProps) => {
  // State to trigger re-render every 30 seconds for auto-updating results
  const [, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    // Update every 30 seconds to check if any time has passed
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const data = times.map((time, index) => {
    const resultItem = logos.find((item: any) => item.time === time);
    const numberValue = resultItem ? resultItem.number : "000";
    const finalDigit = numberValue
      ? String(sumOfDigits(numberValue)).slice(-1)
      : "0";

    let hasPassed;
    if (time === currentResultTime) {
      // For currently rolling result, only show if rolling is complete
      hasPassed = rollingComplete;
    } else {
      // For past results, use existing delay logic
      hasPassed = moment().isAfter(moment(time, "hh:mm A").add(2, 'minutes'));
    }

    const displayValue = hasPassed
      ? `${numberValue || "000"}-${finalDigit}`
      : `000-0`;

    return {
      id: index + 1,
      title: `${time}: ${displayValue}`,
    };
  });
  return (
    <div className={styles.ribbon}>
      <div className={styles.ribbon__track}>
        {/* First set of items */}
        {data.map((item) => (
          <div
            key={`first-${item.id}`}
            className={styles.ribbon__item}
            style={{
              color: item.title.includes("000-0") ? "black" : "red",
              fontStyle: item.title.includes("000-0") ? "normal" : "italic",
              fontWeight: item.title.includes("000-0") ? "normal" : "bold",
            }}
          >
            {item.title}
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {data.map((item) => (
          <div
            key={`second-${item.id}`}
            className={styles.ribbon__item}
            style={{
              color: item.title.includes("000-0") ? "black" : "red",
              fontStyle: item.title.includes("000-0") ? "normal" : "italic",
              fontWeight: item.title.includes("000-0") ? "normal" : "bold",
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NumberRibbon;

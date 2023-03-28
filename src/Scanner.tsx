import Quagga from "@ericblade/quagga2";
import { useEffect, useRef } from "react";

import "./Scanner.scss";

interface ScannerProps {
  on?: boolean;
  modal?: boolean;
}

const Scanner = ({ on = true, modal = true }: ScannerProps) => {
  const targetRef = useRef(null);

  useEffect(() => {
    if (targetRef.current !== null && on) {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: targetRef.current,
          },
          decoder: {
            readers: ["code_128_reader"],
          },
        },
        function (err) {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Initialization finished. Ready to start");
          Quagga.start();
          Quagga.onDetected((data) => {
            Quagga.pause();
            console.log("scanned", data);
          });
        },
      );
    }

    return () => {
      Quagga.stop();
    };
  }, [targetRef]);

  const classes = ["scanner"];
  if (modal) {
    classes.push("modal");
  }

  return (
    <div className={classes.join(" ")}>
      <div ref={targetRef}></div>
    </div>
  );
};

export default Scanner;

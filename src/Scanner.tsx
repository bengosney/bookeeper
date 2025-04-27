import Quagga from "@ericblade/quagga2";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAddBook } from "./documents/book";

import "./Scanner.scss";

interface ScannerProps {
  on?: boolean;
  modal?: boolean;
}

const Scanner = ({ on = true, modal = true }: ScannerProps) => {
  const targetRef = useRef(null);
  const addBook = useAddBook();

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
            if (data.codeResult.code) {
              console.log("found and searching", data.codeResult.code);
              Quagga.pause();
              addBook(data.codeResult.code).then(() => Quagga.start());
            }
          });
        },
      );
    }

    return () => {
      Quagga.offProcessed();
      Quagga.offDetected();
      Quagga.stop();
    };
  }, [targetRef, on, addBook]);

  const classes = ["scanner"];
  if (modal) {
    classes.push("modal");
  }

  return (
    <div className={classes.join(" ")}>
      <div ref={targetRef}></div>
      <Link to="../">Close</Link>
    </div>
  );
};

export default Scanner;

import Quagga from "@ericblade/quagga2";
import { useEffect, useRef } from "react";

const Scanner = ({ on = true }: { on: boolean }) => {
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
        },
      );
    }
  }, [targetRef]);

  return <div ref={targetRef}></div>;
};

export default Scanner;

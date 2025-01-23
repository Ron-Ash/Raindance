import { ReactNode } from "react";

interface pageOptions {
  [key: string]: ReactNode;
}

export default function SwitchCasePage({
  options,
  chosenOption,
}: {
  options: pageOptions;
  chosenOption: string;
}) {
  return (
    <div>
      {Object.entries(options)
        .filter(([name, node]) => name === chosenOption && node != undefined)
        .map((option) => option[1]) ?? <div />}
    </div>
  );
}

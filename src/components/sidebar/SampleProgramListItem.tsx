import React from "react";

type Props = {
  label: string;
  onClick: React.MouseEventHandler;
};

const SampleProgramListItem: React.FC<Props> = ({ label, onClick }) => {
  return (
    <p>
      {label}&nbsp;
      <button onClick={onClick}>Load</button>
    </p>
  );
};

export default SampleProgramListItem;

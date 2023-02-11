import React from "react";
import { Languages } from "../../utils/constants";
import SampleProgramListItem from "./SampleProgramListItem";

import sampleProgramBlinkLoop from "../../programs/python/blink_loop.py?raw";
import sampleProgramImagePixel from "../../programs/python/image_pixel.py?raw";

type Props = {
  languageMode: Languages;
  setProgramState: React.Dispatch<React.SetStateAction<string>>;
};

const getSampleProgramsFrom = (language: Languages): ReadonlyArray<string> => {
  switch (language) {
    case Languages.PYTHON:
      return [sampleProgramImagePixel, sampleProgramBlinkLoop];
    case Languages.SOURCE_THREE:
      return [];
  }
};

const SampleProgramSidebar: React.FC<Props> = ({
  languageMode,
  setProgramState,
}) => {
  const programs = getSampleProgramsFrom(languageMode);
  return (
    <div>
      <p>Sample {languageMode} programs:</p>
      {programs.length == 0 ? (
        <p>No sample programs found.</p>
      ) : (
        programs.map((program, i) => {
          return (
            <SampleProgramListItem
              label={`Sample Program ${i + 1}`}
              onClick={() => setProgramState(program)}
            />
          );
        })
      )}
    </div>
  );
};

export default SampleProgramSidebar;

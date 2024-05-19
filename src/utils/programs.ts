import { Languages } from "./constants";

const loadSamplePythonPrograms = async () =>
  (await import("../programs/python")).samplePythonPrograms;
const loadSampleSourceThreePrograms = async () =>
  (await import("../programs/source3")).sampleSourceThreePrograms;

let samplePythonPrograms: ReadonlyArray<string>;
let sampleSourceThreePrograms: ReadonlyArray<string>;

export const sampleProgramLoader = async (language: Languages) => {
  switch (language) {
    case Languages.PYTHON:
      if (samplePythonPrograms === undefined) {
        samplePythonPrograms = await loadSamplePythonPrograms();
      }
      return samplePythonPrograms;
    case Languages.SOURCE_THREE_INTERPRETER:
      if (sampleSourceThreePrograms === undefined) {
        sampleSourceThreePrograms = await loadSampleSourceThreePrograms();
      }
      return sampleSourceThreePrograms;
  }
};

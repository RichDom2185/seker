import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Languages } from "../../utils/constants";
import SampleProgramListItem from "./SampleProgramListItem";

const getSamplePythonPrograms = async () =>
  (await import("../../programs/python")).samplePythonPrograms;
const getSampleSourceThreePrograms = async () =>
  (await import("../../programs/source3")).sampleSourceThreePrograms;

let samplePythonPrograms: ReadonlyArray<string>;
let sampleSourceThreePrograms: ReadonlyArray<string>;
const getSampleProgramsFrom = async (language: Languages) => {
  switch (language) {
    case Languages.PYTHON:
      if (samplePythonPrograms === undefined) {
        samplePythonPrograms = await getSamplePythonPrograms();
      }
      return samplePythonPrograms;
    case Languages.SOURCE_THREE:
      if (sampleSourceThreePrograms === undefined) {
        sampleSourceThreePrograms = await getSampleSourceThreePrograms();
      }
      return sampleSourceThreePrograms;
  }
};

type Props = {
  languageMode: Languages;
  setProgramState: React.Dispatch<React.SetStateAction<string>>;
};

const SampleProgramSidebar: React.FC<Props> = ({
  languageMode,
  setProgramState,
}) => {
  const [programs, setPrograms] = useState<ReadonlyArray<string>>();
  useEffect(() => {
    setPrograms(undefined);
    getSampleProgramsFrom(languageMode).then(setPrograms);
  }, [languageMode]);

  return (
    <Card>
      <CardHeader>
        <Box>
          <Heading size="md">Sample {languageMode} Programs</Heading>
          <Text>Click on a program below to load them into the editor.</Text>
        </Box>
      </CardHeader>
      <CardBody paddingTop={0}>
        <Stack divider={<StackDivider />}>
          {programs === undefined ? (
            <Text fontStyle="italic" color="gray">
              Loading sample programs&hellip;
            </Text>
          ) : programs.length == 0 ? (
            <Text fontStyle="italic" color="gray">
              No sample programs found.
            </Text>
          ) : (
            programs.map((program, i) => {
              return (
                <SampleProgramListItem
                  // Safe as programs are read only
                  key={i}
                  label={`Sample Program ${i + 1}`}
                  onClick={() => setProgramState(program)}
                />
              );
            })
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default SampleProgramSidebar;

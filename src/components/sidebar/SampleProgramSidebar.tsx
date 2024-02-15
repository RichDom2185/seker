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
import React from "react";
import { Languages } from "../../utils/constants";
import SampleProgramListItem from "./SampleProgramListItem";

import { samplePythonPrograms } from "../../programs/python";
import { sampleSourceThreePrograms } from "../../programs/source3";

type Props = {
  languageMode: Languages;
  setProgramState: React.Dispatch<React.SetStateAction<string>>;
};

const getSampleProgramsFrom = (language: Languages): ReadonlyArray<string> => {
  switch (language) {
    case Languages.PYTHON:
      return samplePythonPrograms;
    case Languages.SOURCE_THREE:
      return sampleSourceThreePrograms;
  }
};

const SampleProgramSidebar: React.FC<Props> = ({
  languageMode,
  setProgramState,
}) => {
  const programs = getSampleProgramsFrom(languageMode);
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
          {programs.length == 0 ? (
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

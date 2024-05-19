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
import { useTypedDispatch, useTypedSelector } from "../../redux/hooks";
import { WorkspaceActions } from "../../redux/reducers/workspace";
import { sampleProgramLoader } from "../../utils/programs";
import SampleProgramListItem from "./SampleProgramListItem";

const { setEditorValue } = WorkspaceActions;

const SampleProgramSidebar: React.FC = () => {
  const [programs, setPrograms] = useState<ReadonlyArray<string>>();
  const languageMode = useTypedSelector(
    (state) => state.workspace.currentLanguage
  );
  const dispatch = useTypedDispatch();

  useEffect(() => {
    setPrograms(undefined);
    sampleProgramLoader(languageMode).then(setPrograms);
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
                  onClick={() => dispatch(setEditorValue(program))}
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

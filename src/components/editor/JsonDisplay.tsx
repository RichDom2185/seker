import { Box, Card, CardBody, Code, Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  jsonProgram: string;
};

const JsonDisplay: React.FC<Props> = ({ jsonProgram }) => {
  return (
    <Card>
      <CardBody>
        <Text>JSON Code:</Text>
        <Box overflowX="scroll">
          <Code display="block" whiteSpace="pre" width="max-content">
            {jsonProgram}
          </Code>
        </Box>
      </CardBody>
    </Card>
  );
};

export default JsonDisplay;

import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  label: string;
  onClick: React.MouseEventHandler;
};

const SampleProgramListItem: React.FC<Props> = ({ label, onClick }) => {
  return (
    <Box>
      <Button
        size="sm"
        variant="link"
        fontWeight="normal"
        width="full"
        iconSpacing="auto"
        rightIcon={
          <HStack spacing={1}>
            <Text>Load</Text>
            <ArrowForwardIcon />
          </HStack>
        }
        onClick={onClick}
      >
        {label}
      </Button>
    </Box>
  );
};

export default SampleProgramListItem;

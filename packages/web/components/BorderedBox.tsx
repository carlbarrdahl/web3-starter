import React from "react";
import {
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}
export default function BorderedBox(props: Props) {
  const borderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
        borderWidth={1}
        borderColor={borderColor}
        borderRadius="md"
        px={3}
        py={2}
        {...props}
      />
  );
}

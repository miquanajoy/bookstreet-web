import { useRef } from "react";
import { useButton } from "react-aria";
import { Button as ChakraButton } from "@chakra-ui/react";

export function CalendarButton(props) {
  let ref = useRef();
  let { buttonProps } = useButton(props, ref);
  return (
    <ChakraButton {...buttonProps} ref={ref} size="sm">
      {props.children}
    </ChakraButton>
  );
}

export function FieldButton(props) {
  let ref = useRef();
  let { buttonProps } = useButton(props, ref);
  return (
    <ChakraButton {...buttonProps} ref={ref} size="sm" h="1.75rem" mr="2">
      {props.children}
    </ChakraButton>
  );
}

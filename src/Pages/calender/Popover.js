import { useRef } from "react";
import { usePopover, Overlay, DismissButton } from "@react-aria/overlays";
import { Box } from "@chakra-ui/react";

export function Popover(props) {
  let ref = useRef(null);
  let { state, children } = props;

  let { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      popoverRef: ref
    },
    state
  );

  // Add a hidden <DismissButton> component at the end of the popover
  // to allow screen reader users to dismiss the popup easily.
  return (
    <Overlay>
      <div {...underlayProps} style={{ display: "fixed", inset: 0 }} />
      <Box
        {...popoverProps}
        ref={ref}
        background="white"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        position="absolute"
        zIndex="10"
        top="100%"
        boxShadow="lg"
        marginTop="1"
        padding="6"
        outline="none"
        overflow="auto"
      >
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </Box>
    </Overlay>
  );
}

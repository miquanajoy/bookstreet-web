import { useRef } from "react";
import { useDateRangePickerState } from "react-stately";
import { useDateRangePicker } from "react-aria";
import { FieldButton } from "./Button";
import { RangeCalendar } from "./RangeCalendar";
import { DateField, StyledField, TimeField } from "./DateField";
import { Popover } from "./Popover";
import { Dialog } from "./Dialog";
import { CalendarIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  FormLabel,
  InputGroup,
  Box,
  InputRightElement
} from "@chakra-ui/react";

export function DateRangePicker(props) {
  let state = useDateRangePickerState({
    ...props,
    shouldCloseOnSelect: false
  });
  let ref = useRef();
  let {
    groupProps,
    labelProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps
  } = useDateRangePicker(props, state, ref);

  return (
    <Box position="relative" display="inline-flex" flexDirection="column">
      <FormLabel {...labelProps}>{props.label}</FormLabel>
      <InputGroup {...groupProps} ref={ref} width="auto" display="inline-flex">
        <StyledField pr="5.5rem">
          <DateField {...startFieldProps} />
          <Box as="span" aria-hidden="true" paddingX="2">
            –
          </Box>
          <DateField {...endFieldProps} />
          {state.validationState === "invalid" && (
            <NotAllowedIcon color="red.600" position="absolute" right="12" />
          )}
        </StyledField>
        <InputRightElement>
          <FieldButton {...buttonProps} isPressed={state.isOpen}>
            <CalendarIcon />
          </FieldButton>
        </InputRightElement>
      </InputGroup>
      {state.isOpen && (
        <Popover triggerRef={ref} state={state} placement="bottom start">
          <Dialog {...dialogProps}>
            <RangeCalendar {...calendarProps} />
            <Box display="flex" gap="2">
              <TimeField
                label="Start time"
                value={state.timeRange?.start || null}
                onChange={(v) => state.setTime("start", v)}
              />
              <TimeField
                label="End time"
                value={state.timeRange?.end || null}
                onChange={(v) => state.setTime("end", v)}
              />
            </Box>
          </Dialog>
        </Popover>
      )}
    </Box>
  );
}

import { Action, ActionPanel, closeMainWindow, Form, getPreferenceValues, Toast } from "@raycast/api";
import { createCustomTimer, ensureCTFileExists, startTimer } from "./timerUtils";
import { CTInlineArgs, InputField, Values } from "./types";

export default function CustomTimerView(props: { arguments: CTInlineArgs }) {
  const hasArgs = Object.values(props.arguments).some((x) => x !== "");

  const handleSubmit = (values: Values) => {
    ensureCTFileExists();
    if (values.hours === "" && values.minutes === "" && values.seconds === "") {
      const toast = new Toast({ style: Toast.Style.Failure, title: "No values set for timer length!" });
      toast.show();
    } else if (isNaN(Number(values.hours))) {
      const toast = new Toast({ style: Toast.Style.Failure, title: "Hours must be a number!" });
      toast.show();
    } else if (isNaN(Number(values.minutes))) {
      const toast = new Toast({ style: Toast.Style.Failure, title: "Minutes must be a number!" });
      toast.show();
    } else if (isNaN(Number(values.seconds))) {
      const toast = new Toast({ style: Toast.Style.Failure, title: "Seconds must be a number!" });
      toast.show();
    } else {
      closeMainWindow();
      const timerName = values.name ? values.name : "Untitled";
      const timeInSeconds = 3600 * Number(values.hours) + 60 * Number(values.minutes) + Number(values.seconds);
      startTimer(timeInSeconds, timerName);
      if (values.willBeSaved) createCustomTimer({ name: values.name, timeInSeconds: timeInSeconds });
    }
  };

  const inputFields: InputField[] = [
    { id: "hours", title: "Hours", placeholder: "0" },
    { id: "minutes", title: "Minutes", placeholder: "00" },
    { id: "seconds", title: "Seconds", placeholder: "00" },
  ];
  const sortOrder = getPreferenceValues().newTimerInputOrder;
  sortOrder !== "hhmmss" ? inputFields.reverse() : inputFields;

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Start Custom Timer" onSubmit={(values: Values) => handleSubmit(values)} />
        </ActionPanel>
      }
    >
      {inputFields.map((item, index) => (
        <Form.TextField
          key={index}
          id={item.id}
          title={item.title}
          placeholder={item.placeholder}
          defaultValue={props.arguments[item.id]}
        />
      ))}
      <Form.TextField id="name" title="Name" placeholder="Pour Tea" autoFocus={hasArgs} />
      <Form.Checkbox id="willBeSaved" label="Save as preset" />
    </Form>
  );
}

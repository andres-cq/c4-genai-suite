import { Button, Group, Stack, Textarea, TextInput } from '@mantine/core';
import { useState } from 'react';
import { PromptVariable } from 'src/types/prompt-template';

interface PromptVariableFormProps {
  variables: PromptVariable[];
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
}

export function PromptVariableForm({ variables, onSubmit, onCancel }: PromptVariableFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    variables.forEach((variable) => {
      initial[variable.name] = variable.defaultValue || '';
    });
    return initial;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const isValid = variables.every((variable) => {
    if (variable.required) {
      return values[variable.name]?.trim().length > 0;
    }
    return true;
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {variables.map((variable) => {
          const isMultiline = variable.name === 'code' || variable.name === 'notes' || variable.name === 'dataset';

          if (isMultiline) {
            return (
              <Textarea
                key={variable.name}
                label={variable.label}
                description={variable.description}
                placeholder={`Enter ${variable.label.toLowerCase()}...`}
                value={values[variable.name]}
                onChange={(e) => setValues({ ...values, [variable.name]: e.target.value })}
                required={variable.required}
                minRows={4}
                maxRows={10}
              />
            );
          }

          return (
            <TextInput
              key={variable.name}
              label={variable.label}
              description={variable.description}
              placeholder={`Enter ${variable.label.toLowerCase()}...`}
              value={values[variable.name]}
              onChange={(e) => setValues({ ...values, [variable.name]: e.target.value })}
              required={variable.required}
            />
          );
        })}

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid}>
            Insert Prompt
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

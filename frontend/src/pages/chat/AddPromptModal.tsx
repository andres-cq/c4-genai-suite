import { Button, Flex, Portal, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Modal } from 'src/components';
import { texts } from 'src/texts';

interface AddPromptModalProps {
  onClose: () => void;
  onSave: (title: string, prompt: string) => void;
}

interface PromptFormValues {
  title: string;
  prompt: string;
}

export function AddPromptModal({ onClose, onSave }: AddPromptModalProps) {
  const form = useForm<PromptFormValues>({
    mode: 'controlled',
    initialValues: {
      title: '',
      prompt: '',
    },
    validate: {
      title: (value) => (value.trim().length === 0 ? 'Title is required' : null),
      prompt: (value) => (value.trim().length === 0 ? 'Prompt is required' : null),
    },
  });

  const handleSubmit = (values: PromptFormValues) => {
    onSave(values.title, values.prompt);
    onClose();
  };

  return (
    <Portal>
      <Modal
        onClose={onClose}
        header="Add Prompt"
        size="xl"
        footer={
          <Flex gap="sm" justify="end">
            <Button onClick={onClose} variant="subtle">
              {texts.common.cancel}
            </Button>
            <Button type="submit" form="add-prompt-form">
              {texts.common.save}
            </Button>
          </Flex>
        }
      >
        <form id="add-prompt-form" onSubmit={form.onSubmit(handleSubmit)}>
          <fieldset className="flex flex-col gap-4">
            <TextInput
              withAsterisk
              label="Title"
              placeholder="Enter prompt title"
              key={form.key('title')}
              {...form.getInputProps('title')}
              autoFocus
            />
            <Textarea
              withAsterisk
              label="Prompt"
              placeholder="Enter your prompt text"
              key={form.key('prompt')}
              {...form.getInputProps('prompt')}
              resize="vertical"
              minRows={15}
              autosize
            />
          </fieldset>
        </form>
      </Modal>
    </Portal>
  );
}

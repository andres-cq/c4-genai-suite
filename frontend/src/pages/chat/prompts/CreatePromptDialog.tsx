import { Button, Group, Modal, Stack, Textarea, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { PromptTemplate } from 'src/types/prompt-template';

interface CreatePromptDialogProps {
  opened: boolean;
  onClose: () => void;
  onSave: (prompt: Partial<PromptTemplate>) => void;
  initialPrompt?: PromptTemplate | null;
}

export function CreatePromptDialog({ opened, onClose, onSave, initialPrompt }: CreatePromptDialogProps) {
  const [title, setTitle] = useState('');
  const [promptText, setPromptText] = useState('');

  useEffect(() => {
    if (initialPrompt) {
      setTitle(initialPrompt.title);
      setPromptText(initialPrompt.promptText);
    } else {
      setTitle('');
      setPromptText('');
    }
  }, [initialPrompt, opened]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      promptText,
      ...(initialPrompt || {}),
    });
    setTitle('');
    setPromptText('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setPromptText('');
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={initialPrompt ? 'Edit Prompt' : 'Create Prompt'} size="lg">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="e.g., Summarize Text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Prompt Text"
            placeholder="Enter your prompt here..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            required
            minRows={6}
            maxRows={15}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !promptText.trim()}>
              {initialPrompt ? 'Save Changes' : 'Create Prompt'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

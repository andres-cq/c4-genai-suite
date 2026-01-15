import { Button, Group, Modal, Stack, Textarea, TextInput } from '@mantine/core';
import { useState } from 'react';

interface CreatePromptDialogProps {
  opened: boolean;
  onClose: () => void;
}

export function CreatePromptDialog({ opened, onClose }: CreatePromptDialogProps) {
  const [title, setTitle] = useState('');
  const [promptText, setPromptText] = useState('');

  const handleClose = () => {
    setTitle('');
    setPromptText('');
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={'Create Prompt'} size="lg">
      <form>
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
              Create Prompt
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

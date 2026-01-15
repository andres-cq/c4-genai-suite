import { Button, Group, Modal, Stack, Textarea, TextInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useApi } from 'src/api';
import { buildError } from 'src/lib';

interface CreatePromptDialogProps {
  opened: boolean;
  onClose: () => void;
}

export function CreatePromptDialog({ opened, onClose }: CreatePromptDialogProps) {
  const api = useApi();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [promptText, setPromptText] = useState('');

  const createPrompt = useMutation({
    mutationFn: () =>
      api.prompts.createPrompt({
        title: title.trim(),
        description: description.trim() || undefined,
        promptText: promptText.trim(),
      }),
    onSuccess: () => {
      toast.success('Prompt created successfully!');
      handleClose();
    },
    onError: async (error) => {
      toast.error(await buildError('Failed to create prompt', error));
    },
  });

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPromptText('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !promptText.trim()) {
      toast.error('Title and Prompt Text are required');
      return;
    }
    createPrompt.mutate();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={'Create Prompt'} size="lg">
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
            label="Description"
            placeholder="Optional description of your prompt"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={2}
            maxRows={4}
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
            <Button variant="subtle" onClick={handleClose} disabled={createPrompt.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !promptText.trim()} loading={createPrompt.isPending}>
              Create Prompt
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

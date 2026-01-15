import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { MOCK_PROMPTS } from 'src/mock/prompt-templates';
import { CreatePromptDialog } from 'src/pages/chat/prompts/CreatePromptDialog';
import { PromptCard } from 'src/pages/chat/prompts/PromptCard';
import { PromptTemplate } from 'src/types/prompt-template';

interface PromptLibraryModalProps {
  opened: boolean;
  onClose: () => void;
}

export function PromptLibraryModal({ opened, onClose }: PromptLibraryModalProps) {
  const [prompts] = useState<PromptTemplate[]>(MOCK_PROMPTS);
  const [createPromptOpened, setCreatePromptOpened] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleCreatePrompt = () => {
    setCreatePromptOpened(true);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        title={'Prompt Library'}
        size="90%"
        fullScreen={false}
        centered
        styles={{
          body: {
            maxHeight: '70vh',
            overflow: 'auto',
          },
        }}
      >
        <Stack gap="md">
          {/* Header Actions */}
          <Group justify="space-between">
            <Button leftSection={<IconPlus size={16} />} size="xs" onClick={handleCreatePrompt}>
              New Prompt
            </Button>
          </Group>
          {/* Prompts Grid*/}
          {prompts.length === 0 ? (
            <div className="py-12 text-center">
              <Text size="sm" c="dimmed">
                No prompts yet. Create your first prompt!
              </Text>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          )}
        </Stack>
      </Modal>

      <CreatePromptDialog opened={createPromptOpened} onClose={() => setCreatePromptOpened(false)} />
    </>
  );
}

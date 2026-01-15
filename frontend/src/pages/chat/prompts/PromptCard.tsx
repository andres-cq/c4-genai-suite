import { ActionIcon, Badge, Card, Group, Menu, Text } from '@mantine/core';
import { IconDotsVertical, IconStarFilled } from '@tabler/icons-react';
import { PROMPT_CATEGORIES, PromptTemplate } from 'src/types/prompt-template';

interface PromptCardProps {
  prompt: PromptTemplate;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const categoryLabel = PROMPT_CATEGORIES.find((c) => c.value === prompt.category)?.label;

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder className="cursor-pointer transition-all hover:shadow-md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Group gap="xs">
            <Text fw={600} size="sm" lineClamp={1}>
              {prompt.title}
            </Text>
            {prompt.isFavorite && <IconStarFilled size={14} className="text-yellow-500" />}
          </Group>
          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
          </Menu>
        </Group>
      </Card.Section>

      <div className="mt-3 space-y-2">
        {prompt.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {prompt.description}
          </Text>
        )}

        <Group gap="xs">
          {categoryLabel && (
            <Badge size="sm" variant="light" color="blue">
              {categoryLabel}
            </Badge>
          )}
        </Group>

        <Text size="xs" c="dimmed" className="line-clamp-3 font-mono">
          {prompt.promptText}
        </Text>
      </div>
    </Card>
  );
}

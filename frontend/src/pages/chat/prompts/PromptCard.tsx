import { ActionIcon, Badge, Card, Group, Menu, Text } from '@mantine/core';
import { IconDotsVertical, IconStarFilled } from '@tabler/icons-react';
import { PromptDto } from 'src/api';
import { PROMPT_CATEGORIES, PromptTemplate } from 'src/types/prompt-template';

interface PromptCardProps {
  prompt: PromptTemplate | PromptDto;
}

export function PromptCard({ prompt }: PromptCardProps) {
  // Category is optional - only exists on PromptTemplate (mock data)
  const category = 'category' in prompt ? prompt.category : undefined;
  const categoryLabel = category ? PROMPT_CATEGORIES.find((c) => c.value === category)?.label : undefined;

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder className="cursor-pointer transition-all hover:shadow-md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between" gap="xs">
          <Group gap="xs" className="min-w-0 flex-1">
            <Text fw={600} size="sm" lineClamp={1} className="flex-1">
              {prompt.title}
            </Text>
            {prompt.isFavorite && <IconStarFilled size={12} className="shrink-0 text-yellow-500" />}
          </Group>
          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <ActionIcon
                size="sm"
                variant="subtle"
                color="gray"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <IconDotsVertical size={14} />
              </ActionIcon>
            </Menu.Target>
          </Menu>
        </Group>
      </Card.Section>

      <div className="mt-2 space-y-1.5">
        {prompt.description && (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {prompt.description}
          </Text>
        )}

        {categoryLabel && (
          <Badge size="xs" variant="light" color="blue">
            {categoryLabel}
          </Badge>
        )}

        <Text size="xs" c="dimmed" className="line-clamp-2 font-mono">
          {prompt.promptText}
        </Text>
      </div>
    </Card>
  );
}

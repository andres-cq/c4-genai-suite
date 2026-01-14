import { ActionIcon, Badge, Card, Group, Menu, Text } from '@mantine/core';
import {
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconStar,
  IconStarFilled,
  IconTrash,
} from '@tabler/icons-react';
import { PromptTemplate, PROMPT_CATEGORIES } from 'src/types/prompt-template';

interface PromptCardProps {
  prompt: PromptTemplate;
  onSelect: (prompt: PromptTemplate) => void;
  onEdit?: (prompt: PromptTemplate) => void;
  onDelete?: (prompt: PromptTemplate) => void;
  onToggleFavorite?: (prompt: PromptTemplate) => void;
  onDuplicate?: (prompt: PromptTemplate) => void;
}

export function PromptCard({ prompt, onSelect, onEdit, onDelete, onToggleFavorite, onDuplicate }: PromptCardProps) {
  const categoryLabel = PROMPT_CATEGORIES.find((c) => c.value === prompt.category)?.label;

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={() => onSelect(prompt)}
    >
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
            <Menu.Dropdown>
              {onToggleFavorite && (
                <Menu.Item
                  leftSection={prompt.isFavorite ? <IconStar size={14} /> : <IconStarFilled size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(prompt);
                  }}
                >
                  {prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                </Menu.Item>
              )}
              {onEdit && (
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(prompt);
                  }}
                >
                  Edit
                </Menu.Item>
              )}
              {onDuplicate && (
                <Menu.Item
                  leftSection={<IconCopy size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(prompt);
                  }}
                >
                  Duplicate
                </Menu.Item>
              )}
              {onDelete && (
                <Menu.Item
                  leftSection={<IconTrash size={14} />}
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(prompt);
                  }}
                >
                  Delete
                </Menu.Item>
              )}
            </Menu.Dropdown>
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
          {prompt.variables && prompt.variables.length > 0 && (
            <Badge size="sm" variant="light" color="grape">
              {prompt.variables.length} variable{prompt.variables.length > 1 ? 's' : ''}
            </Badge>
          )}
          {prompt.usageCount > 0 && (
            <Badge size="sm" variant="light" color="gray">
              Used {prompt.usageCount}x
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

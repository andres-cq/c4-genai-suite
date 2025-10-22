import { Button, Menu, rem } from '@mantine/core';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { memo, useState } from 'react';
import { texts } from 'src/texts';
import { isMobile } from '../utils';

interface PromptItemProps {
  prompt: {
    id: string;
    title: string;
    content: string;
  };
  onSelect: (prompt: { id: string; title: string; content: string }) => void;
  onEdit?: (prompt: { id: string; title: string; content: string }) => void;
  onDelete?: (id: string) => void;
}

export const PromptItem = memo(({ prompt, onSelect, onEdit, onDelete }: PromptItemProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Button
      size="sm"
      p="xs"
      onClick={() => onSelect(prompt)}
      fullWidth
      justify="space-between"
      variant="subtle"
      classNames={{ root: 'relative group transition-all' }}
    >
      {prompt.title}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-0 right-0 flex h-full items-center px-2 ${isMobile() ? '' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <Menu width={200} opened={menuOpen} onChange={setMenuOpen}>
          <Menu.Target>
            <IconDots style={{ width: rem(18), height: rem(18) }} />
          </Menu.Target>
          <Menu.Dropdown>
            {onEdit && (
              <Menu.Item leftSection={<IconEdit className="h-4 w-4" />} onClick={() => onEdit(prompt)}>
                {texts.common.edit}
              </Menu.Item>
            )}
            {onDelete && (
              <Menu.Item
                leftSection={<IconTrash className="h-4 w-4" />}
                onClick={() => onDelete(prompt.id)}
                color="red"
              >
                {texts.common.remove}
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </div>
    </Button>
  );
});

PromptItem.displayName = 'PromptItem';

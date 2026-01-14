import { ActionIcon, Badge, Button, Group, Modal, SegmentedControl, Stack, Text, TextInput } from '@mantine/core';
import { IconPlus, IconSearch, IconStar, IconX } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { PromptCategory, PromptTemplate, PROMPT_CATEGORIES } from 'src/types/prompt-template';
import { PromptCard } from './PromptCard';
import { PromptVariableForm } from './PromptVariableForm';

interface PromptLibraryModalProps {
  opened: boolean;
  onClose: () => void;
  onSelectPrompt: (promptText: string, promptId?: number) => void;
  prompts: PromptTemplate[];
  onCreatePrompt?: () => void;
  onEditPrompt?: (prompt: PromptTemplate) => void;
  onDeletePrompt?: (prompt: PromptTemplate) => void;
  onToggleFavorite?: (prompt: PromptTemplate) => void;
  onDuplicatePrompt?: (prompt: PromptTemplate) => void;
}

export function PromptLibraryModal({
  opened,
  onClose,
  onSelectPrompt,
  prompts,
  onCreatePrompt,
  onEditPrompt,
  onDeletePrompt,
  onToggleFavorite,
  onDuplicatePrompt,
}: PromptLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null);

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.promptText.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = categoryFilter === 'all' || prompt.category === categoryFilter;

      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || prompt.isFavorite;

      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [prompts, searchQuery, categoryFilter, showFavoritesOnly]);

  // Sort by usage count and favorites
  const sortedPrompts = useMemo(() => {
    return [...filteredPrompts].sort((a, b) => {
      // Favorites first
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;

      // Then by usage count
      return b.usageCount - a.usageCount;
    });
  }, [filteredPrompts]);

  const handlePromptSelect = (prompt: PromptTemplate) => {
    if (prompt.variables && prompt.variables.length > 0) {
      // Show variable form
      setSelectedPrompt(prompt);
    } else {
      // Insert directly
      onSelectPrompt(prompt.promptText, prompt.id);
      onClose();
    }
  };

  const handleVariableSubmit = (values: Record<string, string>) => {
    if (!selectedPrompt) return;

    // Replace variables in prompt text
    let finalPrompt = selectedPrompt.promptText;
    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      finalPrompt = finalPrompt.replace(regex, value);
    });

    onSelectPrompt(finalPrompt, selectedPrompt.id);
    setSelectedPrompt(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedPrompt(null);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={selectedPrompt ? 'Fill in Variables' : 'Prompt Library'}
      size={selectedPrompt ? 'md' : 'xl'}
      styles={{
        body: {
          maxHeight: '70vh',
          overflow: 'auto',
        },
      }}
    >
      {selectedPrompt ? (
        <div>
          <Text size="sm" c="dimmed" mb="md">
            {selectedPrompt.title}
          </Text>
          <PromptVariableForm
            variables={selectedPrompt.variables || []}
            onSubmit={handleVariableSubmit}
            onCancel={() => setSelectedPrompt(null)}
          />
        </div>
      ) : (
        <Stack gap="md">
          {/* Header Actions */}
          <Group justify="space-between">
            <Group gap="xs">
              <Badge
                variant={showFavoritesOnly ? 'filled' : 'light'}
                color="yellow"
                className="cursor-pointer"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                leftSection={<IconStar size={12} />}
              >
                Favorites {showFavoritesOnly && `(${prompts.filter((p) => p.isFavorite).length})`}
              </Badge>
              <Text size="sm" c="dimmed">
                {sortedPrompts.length} prompt{sortedPrompts.length !== 1 ? 's' : ''}
              </Text>
            </Group>
            {onCreatePrompt && (
              <Button leftSection={<IconPlus size={16} />} size="xs" onClick={onCreatePrompt}>
                New Prompt
              </Button>
            )}
          </Group>

          {/* Search */}
          <TextInput
            placeholder="Search prompts..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            rightSection={
              searchQuery && (
                <ActionIcon variant="subtle" onClick={() => setSearchQuery('')}>
                  <IconX size={16} />
                </ActionIcon>
              )
            }
          />

          {/* Category Filter */}
          <SegmentedControl
            value={categoryFilter}
            onChange={setCategoryFilter}
            data={[
              { label: 'All', value: 'all' },
              ...PROMPT_CATEGORIES.map((cat) => ({
                label: cat.label,
                value: cat.value,
              })),
            ]}
            fullWidth
          />

          {/* Prompt Grid */}
          {sortedPrompts.length === 0 ? (
            <div className="py-12 text-center">
              <Text size="sm" c="dimmed">
                {searchQuery || categoryFilter !== 'all' || showFavoritesOnly
                  ? 'No prompts found matching your filters'
                  : 'No prompts yet. Create your first prompt!'}
              </Text>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {sortedPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onSelect={handlePromptSelect}
                  onEdit={onEditPrompt}
                  onDelete={onDeletePrompt}
                  onToggleFavorite={onToggleFavorite}
                  onDuplicate={onDuplicatePrompt}
                />
              ))}
            </div>
          )}
        </Stack>
      )}
    </Modal>
  );
}

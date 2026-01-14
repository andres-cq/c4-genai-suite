import { ActionIcon, Button, Portal } from '@mantine/core';
import { IconFilter, IconPaperclip } from '@tabler/icons-react';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { ConfigurationDto, FileDto } from 'src/api';
import { Icon, Markdown } from 'src/components';
import { ExtensionContext, JSONObject, useEventCallback, useExtensionContext, usePersistentState, useTheme } from 'src/hooks';
import { useSpeechRecognitionToggle } from 'src/hooks/useSpeechRecognitionToggle';
import { FileItemComponent } from 'src/pages/chat/conversation/FileItem';
import { FilterModal } from 'src/pages/chat/conversation/FilterModal';
import { Language, SpeechRecognitionButton } from 'src/pages/chat/conversation/SpeechRecognitionButton';
import { texts } from 'src/texts';
import { useChatDropzone } from '../useChatDropzone';
import { Suggestions } from './Suggestions';
import { PromptTemplate } from 'src/types/prompt-template';
import {
  getDefault,
  isExtensionWithUserArgs,
  UserArgumentDefaultValueByExtensionIDAndName,
  valueIsDefined,
  valueToString,
} from './chat-input-utils';

interface ChatInputProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  configuration?: ConfigurationDto;
  chatId: number;
  isDisabled?: boolean;
  isEmpty?: boolean;
  submitMessage: (input: string, files?: FileDto[]) => void;
  promptToInsert?: string | null;
  onPromptInserted?: () => void;
  onOpenPromptLibrary?: () => void;
  prompts?: PromptTemplate[];
  onSelectPrompt?: (promptText: string, promptId?: number) => void;
}
export function ChatInput({ 
  textareaRef, 
  chatId, 
  configuration, 
  isDisabled, 
  isEmpty, 
  submitMessage,
  promptToInsert,
  onPromptInserted,
  onOpenPromptLibrary,
  prompts = [],
  onSelectPrompt,
}: ChatInputProps) {
  const extensionsWithFilter = configuration?.extensions?.filter(isExtensionWithUserArgs) ?? [];
  const { updateContext, context } = useExtensionContext(chatId);
  const [defaultValues, setDefaultValues] = useState<UserArgumentDefaultValueByExtensionIDAndName>({});
  const {
    uploadingFiles,
    fullFileSlots,
    allowedFileNameExtensions,
    chatFiles,
    handleUploadFile,
    multiple,
    uploadLimitReached,
    refetchConversationFiles,
    uploadMutations,
    upload,
    userBucket,
    remove,
  } = useChatDropzone();

  const speechRecognitionLanguages: Language[] = [
    { name: texts.chat.speechRecognition.languages.de, code: 'de-DE' },
    { name: texts.chat.speechRecognition.languages.en, code: 'en-US' },
  ];

  const [speechLanguage, setSpeechLanguage] = usePersistentState<string>(
    'speechRecognitionLanguage',
    speechRecognitionLanguages[0].code,
  );

  useEffect(() => {
    const defaultValues = configuration?.extensions?.filter(isExtensionWithUserArgs).reduce(
      (prev, extension) => {
        prev[extension.id] = {};
        Object.keys(extension.userArguments).forEach((name) => {
          prev[extension.id][name] = getDefault(extension.userArguments[name]);
        });

        return prev;
      },
      {} as Record<string, JSONObject>,
    );

    setDefaultValues(defaultValues ?? {});
  }, [configuration?.extensions]);

  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(false);
  const [filteredPrompts, setFilteredPrompts] = useState<PromptTemplate[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  useEffect(() => {
    textareaRef?.current?.focus();
  }, [chatId, textareaRef]);

  // Handle prompt insertion from Prompt Library
  useEffect(() => {
    if (promptToInsert) {
      setInput(prev => {
        // If there's existing text, add a newline before the prompt
        const separator = prev.trim() ? '\n\n' : '';
        return prev + separator + promptToInsert;
      });
      onPromptInserted?.();
      textareaRef?.current?.focus();
    }
  }, [promptToInsert, onPromptInserted, textareaRef]);

  const contextWithDefaults = context ?? defaultValues;
  const extensionFilterChips = extensionsWithFilter.map((extension) => ({
    extension: extension,
    filterChips: contextWithDefaults[extension.id]
      ? Object.entries(contextWithDefaults[extension.id] ?? {})
          .filter(valueIsDefined)
          .map(([key, value]) => `${extension?.userArguments[key]?.title}: ${valueToString(value)}`)
      : [],
  }));

  const doSetInput = useEventCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setInput(newValue);
    
    // Show prompt suggestions when user types /
    if (prompts && prompts.length > 0 && onSelectPrompt) {
      const trimmedValue = newValue.trim();
      
      if (trimmedValue.startsWith('/')) {
        const searchQuery = trimmedValue.slice(1).toLowerCase();
        
        // Filter prompts by search query
        const filtered = prompts.filter(prompt => 
          prompt.title.toLowerCase().includes(searchQuery) ||
          prompt.description?.toLowerCase().includes(searchQuery) ||
          prompt.promptText.toLowerCase().includes(searchQuery)
        ).slice(0, 5); // Show max 5 suggestions
        
        setFilteredPrompts(filtered);
        setShowPromptSuggestions(filtered.length > 0);
        setSelectedSuggestionIndex(0);
      } else {
        setShowPromptSuggestions(false);
        setFilteredPrompts([]);
      }
    }
  });

  const doSetText = useEventCallback((text: string, chatFiles?: FileDto[]) => {
    try {
      submitMessage(text, chatFiles);
    } finally {
      setInput('');
    }
  });

  const doSubmit = useEventCallback((event: React.FormEvent) => {
    if (isDisabled || !input || input.length === 0 || upload.status === 'pending') {
      return;
    }
    doSetText(input, chatFiles);
    event.preventDefault();
    void refetchConversationFiles();
  });

  const doKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle prompt suggestions navigation
    if (showPromptSuggestions && filteredPrompts.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredPrompts.length - 1 ? prev + 1 : prev
        );
        return;
      }
      
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
        return;
      }
      
      if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
        event.preventDefault();
        const selectedPrompt = filteredPrompts[selectedSuggestionIndex];
        if (selectedPrompt && onSelectPrompt) {
          onSelectPrompt(selectedPrompt.promptText, selectedPrompt.id);
          setInput('');
          setShowPromptSuggestions(false);
        }
        return;
      }
      
      if (event.key === 'Escape') {
        event.preventDefault();
        setShowPromptSuggestions(false);
        return;
      }
    }

    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
      doSubmit(event);
    }
  });

  const doUpdate = (newContext: ExtensionContext) => {
    updateContext(newContext);
    setShowFilter(false);
  };

  const handleUploadFileFromInput = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    handleUploadFile(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFilePaste = useCallback(
    (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) {
        return;
      }

      const filesToUpload = [] as File[];
      for (let i = 0; i < items.length; i++) {
        const blob = items[i].getAsFile();

        if (!blob) {
          continue;
        }

        filesToUpload.push(blob);
      }

      if (filesToUpload.length) {
        event.preventDefault();
        handleUploadFile(filesToUpload);
      }
    },
    [handleUploadFile],
  );

  useEffect(() => {
    window.addEventListener('paste', handleFilePaste as EventListener);

    return () => {
      window.removeEventListener('paste', handleFilePaste as EventListener);
    };
  }, [handleFilePaste]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const footer = `${configuration?.chatFooter || ''} ${theme.chatFooter || ''}`.trim();

  const { toggleSpeechRecognition, listening } = useSpeechRecognitionToggle({
    speechLanguage,
    onTranscriptUpdate: setInput,
  });

  return (
    <>
      <div className="flex flex-col gap-2">
        {fullFileSlots?.map((slot, index) => (
          <div className="text-sm text-gray-500" key={index}>
            {texts.common.uploadLimit(slot.maxFiles, slot.extensionTitle)}
          </div>
        ))}

        {isEmpty && <Suggestions configuration={configuration} theme={theme} onSelect={setInput} />}

        <div className="flex flex-wrap gap-2">
          {chatFiles.map((file) => (
            <FileItemComponent key={file.id} file={file} onRemove={remove} />
          ))}
          {uploadingFiles.map((file, n) => (
            <FileItemComponent key={`${n}-${file.name}`} file={{ fileName: file.name }} loading={true} />
          ))}
        </div>

        {extensionFilterChips.map(
          (x, index) =>
            x.filterChips?.length > 0 && (
              <div key={index} className="">
                <div className="flex flex-wrap gap-2">
                  {x.filterChips.map((item) => (
                    <div
                      className="cursor-pointer rounded-lg bg-gray-100 px-2 py-1 font-mono text-[0.7rem] hover:opacity-60"
                      onClick={() => setShowFilter(true)}
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ),
        )}
        <form onSubmit={doSubmit}>
          <div className="box-border rounded-2xl border border-gray-200 p-4 pb-3 leading-none shadow-2xl shadow-gray-100 focus-within:border-gray-400 relative">
            {/* Prompt Suggestions Dropdown */}
            {showPromptSuggestions && filteredPrompts.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden z-50">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">
                      Select a prompt (↑↓ to navigate, Enter to select, Esc to close)
                    </span>
                    {onOpenPromptLibrary && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenPromptLibrary();
                          setShowPromptSuggestions(false);
                          setInput('');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Browse All
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {filteredPrompts.map((prompt, index) => (
                    <div
                      key={prompt.id}
                      className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                        index === selectedSuggestionIndex
                          ? 'bg-blue-50 border-l-4 border-l-blue-500'
                          : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                      }`}
                      onClick={() => {
                        if (onSelectPrompt) {
                          onSelectPrompt(prompt.promptText, prompt.id);
                          setInput('');
                          setShowPromptSuggestions(false);
                        }
                      }}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900">
                              {prompt.title}
                            </span>
                            {prompt.isFavorite && (
                              <span className="text-yellow-500 text-xs">★</span>
                            )}
                          </div>
                          {prompt.description && (
                            <p className="text-xs text-gray-600 mb-1 line-clamp-1">
                              {prompt.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 font-mono line-clamp-2">
                            {prompt.promptText}
                          </p>
                        </div>
                        {prompt.category && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded whitespace-nowrap">
                            {prompt.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <TextareaAutosize
              className={`w-full resize-none bg-transparent pb-4 outline-none`}
              maxRows={15}
              minRows={1}
              value={input}
              autoFocus
              onChange={doSetInput}
              onKeyDown={doKeyDown}
              placeholder={prompts && prompts.length > 0 
                ? `${texts.chat.placeholder(configuration?.name ?? '')} (Type / to search prompts)` 
                : texts.chat.placeholder(configuration?.name ?? '')}
              ref={textareaRef}
            />
            <div className="flex w-full justify-between gap-2">
              <div className="flex items-center gap-2">
                {userBucket?.extensions && userBucket.extensions.length > 0 && (
                  <>
                    <input
                      type="file"
                      id="file-upload"
                      data-testid="file-upload"
                      ref={fileInputRef}
                      className="hidden"
                      multiple={multiple}
                      onChange={handleUploadFileFromInput}
                      accept={allowedFileNameExtensions?.join(', ') ?? undefined}
                      disabled={uploadLimitReached}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`cursor-pointer ${uploadLimitReached ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      <ActionIcon
                        component="div"
                        size="lg"
                        variant="outline"
                        color="black"
                        disabled={uploadLimitReached}
                        className={`cursor-pointer border-gray-200 ${uploadLimitReached ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        <IconPaperclip className="w-4" />
                      </ActionIcon>
                    </label>
                  </>
                )}
                {configuration?.extensions?.some(isExtensionWithUserArgs) && (
                  <Button
                    leftSection={<IconFilter className="w-4" />}
                    variant="outline"
                    type="button"
                    onClick={() => setShowFilter(true)}
                    className="border-gray-200"
                  >
                    Filters
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-1">
                {configuration?.extensions?.some((e) => e.name === 'speech-to-text') && (
                  <SpeechRecognitionButton
                    listening={listening}
                    toggleSpeechRecognition={toggleSpeechRecognition}
                    speechLanguage={speechLanguage}
                    setSpeechLanguage={setSpeechLanguage}
                    languages={speechRecognitionLanguages}
                  />
                )}
                <ActionIcon
                  type="submit"
                  size="lg"
                  disabled={!input || isDisabled || uploadMutations.some((m) => m.status === 'pending') || listening}
                  data-testid="chat-submit-button"
                >
                  <Icon icon="arrow-up" />
                </ActionIcon>
              </div>
            </div>
          </div>
        </form>

        {footer && <Markdown className={'mx-auto text-center text-xs text-gray-400'}>{footer}</Markdown>}
      </div>
      {showFilter && (
        <Portal>
          <FilterModal
            onClose={() => setShowFilter(false)}
            extensions={extensionsWithFilter}
            onSubmit={doUpdate}
            values={context}
            defaultValues={defaultValues}
          />
        </Portal>
      )}
    </>
  );
}

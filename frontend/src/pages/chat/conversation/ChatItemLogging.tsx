import { memo, useState } from 'react';
import { Icon, Markdown } from 'src/components';

export interface ChatItemLoggingProps {
  logging: string[];
}

export const ChatItemLogging = memo((props: ChatItemLoggingProps) => {
  const { logging } = props;
  const [isOpen, setIsOpen] = useState(true);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {logging?.length > 0 && (
        <div className="relative my-1 rounded-lg border-[1px] border-gray-300 bg-gray-100 p-4 text-sm">
          <div className="flex items-center justify-between">
            <p className="font-bold">Chunks information</p>
            <div className="cursor-pointer p-1 hover:rounded hover:bg-gray-300" onClick={toggleCollapse}>
              <button aria-label="toggle chunks information">
                <Icon icon={isOpen ? 'collapse-down' : 'collapse-up'} size={16} />
              </button>
            </div>
          </div>
          {!isOpen ? (
            <div className="mt-4 break-words">
              {logging.map((l, i) => (
                <Markdown key={i}>{l}</Markdown>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
});

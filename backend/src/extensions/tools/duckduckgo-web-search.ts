import { DuckDuckGoSearch } from '@langchain/community/tools/duckduckgo_search';
import { ChatContext, ChatMiddleware, ChatNextDelegate, GetContext } from 'src/domain/chat';
import { Extension, ExtensionConfiguration, ExtensionEntity, ExtensionSpec } from 'src/domain/extensions';
import { User } from 'src/domain/users';
import { I18nService } from '../../localization/i18n.service';

@Extension()
export class DuckduckgoWebSearchExtension implements Extension<DuckduckgoWebSearchExtensionConfiguration> {
  constructor(private readonly i18n: I18nService) {}

  get spec(): ExtensionSpec {
    return {
      name: 'duckduckgo-web-search',
      title: this.i18n.t('texts.extensions.duckduckgo.title'),
      logo: '<svg viewBox="0.5 0.5 958.7 958.7" xmlns="http://www.w3.org/2000/svg" width="2500" height="2500"><path d="M479.9 959.2C214.8 959.2.5 745 .5 479.9S214.8.5 479.9.5s479.3 214.3 479.3 479.4S745 959.2 479.9 959.2z" fill="#de5833"/><path d="M920.1 479.9c0 59.9-11.2 117.4-34.4 171.7-22.3 52-53.5 99.1-94.2 139.9-40 39.9-87.1 71.9-139.9 94.2-54.3 22.4-111.8 34.4-171.7 34.4-60 0-117.5-11.2-171.8-34.4-52-22.3-99.1-53.5-139.9-94.2-39.9-40-71.9-87.1-94.2-139.9C51.6 597.3 39.6 539 39.6 479.9c0-60 11.2-117.5 34.4-171.8 22.3-52 53.5-99.1 94.2-139.9 40-39.9 87.1-71.9 139.9-94.2 54.3-22.4 111.8-34.4 171.8-34.4 59.9 0 117.4 11.2 171.7 34.4 52 22.3 99.1 53.5 139.9 94.2 39.9 40 71.9 87.1 94.2 139.9 23.2 54.3 34.4 111.8 34.4 171.8zm-33.6-.8c0-225.4-182.1-407.5-407.4-407.5-225.4 0-407.5 182.9-407.5 407.5 0 176.5 112.6 326.7 269.2 383.5-20.7-87.1-79.9-336.4-93.5-476.2-9.5-99.1 44-152.6 147.1-166.2-44.8-14.4-123.9-10.4-123.9-10.4 1.6-27.2 41.6-32.8 41.6-32.8-20.8-10.3-39.2-15.9-39.2-15.9 110.3-15.2 179.8 22.3 209.3 61.5 119.9 28.7 139.1 166.2 139.1 205.3 0 164.6-138.3-12-138.3 194.2 0 89.5 67.2 210.1 92.7 253.2 178.2-43.1 310.8-203.7 310.8-396.2z" fill="#fff"/><path d="M457.5 546.2c0-52.8 71.9-69.5 99.1-69.5 73.5 0 177.3-47.2 202.9-46.4 26.4.8 43.1 11.2 43.1 23.2 0 17.6-147 83.9-203.7 78.3-54.3-4.8-67.1.8-67.1 23.2 0 19.1 39.1 36.7 82.3 36.7 64.7 0 127.8-28.8 147-15.2 16.8 12-44 55.2-113.5 55.2s-190.1-32.8-190.1-85.5z" fill="#fed30a"/><g fill="#2d4f8d"><path d="M585.3 322.5c-19.2-24.8-53.5-25.6-65.5 3.1 18.4-14.3 40.7-17.5 65.5-3.1zM371.2 323.3c-26.4-16-70.3-17.6-67.9 32.7 13.6-31.2 31.1-36.7 67.9-32.7zM595.7 396c0 14.3-12 26.3-26.4 26.3-14.3 0-26.3-12-26.3-26.3 0-14.4 12-26.4 26.3-26.4 14.4 0 26.4 12 26.4 26.4zm-8.8-10.4c0-4.8-3.2-8-8-8s-8 4-8 8c0 4.8 4 8 8 8s7.2-3.2 8-8zM395.2 414.3c0 16.8-13.6 30.4-30.4 30.4s-30.4-13.6-30.4-30.4c0-16.7 13.6-30.3 30.4-30.3s30.4 13.6 30.4 30.3zm-10.4-11.2c0-4.8-4-8.7-8.8-8.7-4.9 0-8.8 3.9-8.8 8.7 0 4.9 3.9 8.8 8.8 8.8 4.8 0 8.8-3.9 8.8-8.8z"/></g><path d="M261.7 363.2c27.2 197.3 88.7 454.6 101.5 507.4l-21.6-7.2c-20.7-87.1-79.9-337.2-93.5-477-5.5-60.8 12-103.9 50.4-131.9-24 24.8-44 56-36.8 108.7zM271.3 209.8c0-4 1.6-8 3.2-11.2 17.6 0 83.1.8 124.7 20.8 0 0-2.4.8-5.6.8-45.6-14.4-123.1-9.6-122.3-10.4zM310.5 177h1.6c-20.8-10.3-39.2-15.9-39.2-15.9 5.6-.8 10.4-.8 16-1.6 6.4 3.2 16.8 8.7 29.6 17.5h-8z" fill="#d5d7d8"/><path d="M646 837c-11.1 4-64.7-15.2-89.4-24.8-.8 1.6-1.6 3.2-3.2 4-11.2 7.2-42.4 11.2-59.2 7.2h-.8c-27.1 15.2-81.5 44.8-91 39.2-12.8-7.2-15.2-107.1-12.8-131.1.8-18.3 64.7 11.2 96.6 26.4 12-12.8 63.2-17.6 65.6-9.6.8 1.6 1.6 4.8 2.4 8.8 19.9-14.4 72.7-51.9 86.2-48.7 16.8 4 20 124.6 5.6 128.6z" fill="#67bd47"/><path d="M551.8 817c-.8 4-1.6 6.4-4 8-12.8 7.2-44 11.2-60.8 7.2-17.5-2.4-11.1-20-11.1-59.1 0-3.2 3.2-6.4 7.1-8.8 0 39.1-5.5 55.9 11.2 59.1 16 4 45.6.8 57.6-6.4z" fill="#43a347"/></svg>',
      description: this.i18n.t('texts.extensions.duckduckgo.description'),
      type: 'tool',
      arguments: {
        maxResults: {
          type: 'number',
          title: this.i18n.t('texts.extensions.duckduckgo.maxResults'),
          default: 5,
          minimum: 1,
          maximum: 20,
        },
      },
    };
  }

  getMiddlewares(_user: User, extension: ExtensionEntity<DuckduckgoWebSearchExtensionConfiguration>): Promise<ChatMiddleware[]> {
    const middleware = {
      invoke: async (context: ChatContext, getContext: GetContext, next: ChatNextDelegate): Promise<any> => {
        context.tools.push(new DuckDuckGoSearch({ maxResults: extension.values.maxResults || 5 }));
        return next(context);
      },
    };

    return Promise.resolve([middleware]);
  }
}

export type DuckduckgoWebSearchExtensionConfiguration = ExtensionConfiguration & {
  maxResults?: number;
};

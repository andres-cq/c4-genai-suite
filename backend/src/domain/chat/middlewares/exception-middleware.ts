import { Injectable, Logger } from '@nestjs/common';
import { is } from 'src/lib';
import { I18nService } from '../../../localization/i18n.service';
import { ChatContext, ChatError, ChatMiddleware, ChatNextDelegate, GetContext } from '../interfaces';
import { isContentFilterError } from './error/content-filter.error';
import { isContextLengthExceededError } from './error/context-length-exceeded.error';
import { isFailedToolUseError } from './error/failed-tool-use.error';
import { isStringAboveMaxLengthError } from './error/string-above-max-length.error';

@Injectable()
export class ExceptionMiddleware implements ChatMiddleware {
  private readonly logger = new Logger(ExceptionMiddleware.name);

  constructor(private readonly i18n: I18nService) {}

  public static ORDER = -1000;

  order?: number = ExceptionMiddleware.ORDER;

  async invoke(context: ChatContext, getContext: GetContext, next: ChatNextDelegate): Promise<any> {
    try {
      await next(context);
    } catch (err) {
      this.logger.error('Pipeline error.', err);

      if (is(err, ChatError)) {
        context.result.error({ type: 'error', message: err.message });
      } else if (isContextLengthExceededError(err)) {
        context.result.error({ type: 'error', message: this.i18n.t('texts.chat.errorContextLengthExceeded') });
      } else if (isStringAboveMaxLengthError(err)) {
        context.result.error({ type: 'error', message: this.i18n.t('texts.chat.errorStringAboveMaxLength') });
      } else if (isFailedToolUseError(err)) {
        context.result.error({ type: 'error', message: this.i18n.t('texts.chat.errorFailedToolUse') });
      } else if (isContentFilterError(err)) {
        context.result.error({ type: 'error', message: this.i18n.t('texts.chat.errorContentFilter') });
      } else {
        context.result.error({ type: 'error', message: this.i18n.t('texts.chat.errorInternal') });
      }
    }
  }
}

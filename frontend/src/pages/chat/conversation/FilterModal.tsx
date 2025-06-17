import { Button, Fieldset } from '@mantine/core';
import { IconRotate } from '@tabler/icons-react';
import { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ExtensionUserInfoDto } from 'src/api';
import { Modal } from 'src/components';
import { ExtensionContext } from 'src/hooks';
import { Argument } from 'src/pages/admin/extensions/ExtensionForm';
import { useUserArgumentsSpecResolver } from 'src/pages/admin/extensions/hooks';
import { texts } from 'src/texts';

interface JsonFormProps {
  onClose?: () => void;
  extensions: ExtensionUserInfoDto[];
  onSubmit: (newContext: ExtensionContext) => void;
  values?: ExtensionContext;
  defaultValues?: ExtensionContext;
}

export function FilterModal(props: JsonFormProps & PropsWithChildren) {
  const { extensions, onClose, values, defaultValues } = props;

  const form = useForm<ExtensionContext>({
    resolver: useUserArgumentsSpecResolver(extensions),
    defaultValues: values ?? defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((v) => props.onSubmit(v))}>
        <Modal
          onClose={onClose}
          header={texts.chat.filterHeadline}
          footer={
            <fieldset>
              <div className="flex flex-row justify-between">
                <Button
                  type="button"
                  variant="outline"
                  leftSection={<IconRotate className="w-4" />}
                  onClick={() => form.reset(defaultValues)}
                >
                  {texts.chat.filterResetAll}
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="subtle" onClick={onClose}>
                    {texts.common.cancel}
                  </Button>
                  <Button type="submit">{texts.chat.filterApply}</Button>
                </div>
              </div>
            </fieldset>
          }
        >
          <div className="flex flex-col">
            {extensions.map((x) => (
              <Fieldset
                key={x.name}
                legend={
                  <div className="flex items-center">
                    <h4 className="mr-2.5 font-bold">{x.title}</h4>
                    <p className="text-xs">{x.description}</p>
                  </div>
                }
              >
                {Object.entries(x.userArguments).map(([name, spec]) => (
                  <Argument
                    namePrefix={`${x.id}.`}
                    refreshable
                    vertical
                    key={`${x.id}-${name}`}
                    buckets={[]}
                    name={name}
                    argument={spec}
                  />
                ))}
              </Fieldset>
            ))}
          </div>
        </Modal>
      </form>
    </FormProvider>
  );
}

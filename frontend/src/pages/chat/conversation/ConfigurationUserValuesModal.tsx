import { Button, Fieldset, Portal } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PropsWithChildren, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ConfigurationDto, useApi } from 'src/api';
import { Modal } from 'src/components';
import { ExtensionContext } from 'src/hooks';
import { Argument } from 'src/pages/admin/extensions/ExtensionForm';
import { useArgumentObjectSpecResolver } from 'src/pages/admin/extensions/hooks';
import { texts } from 'src/texts';

interface JsonFormProps {
  configuration: ConfigurationDto;
  onClose: () => void;
  onSubmit: () => void;
}

export function ConfigurationUserValuesModal(props: JsonFormProps & PropsWithChildren) {
  const { configuration, onClose, onSubmit } = props;
  const api = useApi();

  const { data: fetchedValues } = useQuery({
    queryKey: [`configuration:${configuration.id}:user-values:default`],
    queryFn: () => api.extensions.getConfigurationUserValues(configuration.id),
    enabled: !!configuration.configurableArguments,
  });

  const form = useForm<ExtensionContext>({
    resolver: useArgumentObjectSpecResolver(configuration.configurableArguments),
    defaultValues: fetchedValues?.values ?? {},
  });

  const updateValues = useMutation({
    mutationFn: (values: ExtensionContext) => {
      return api.extensions.updateConfigurationUserValues(configuration.id, { values });
    },
    onSuccess: (data) => {
      form.reset(data.values);
      onSubmit();
    },
  });

  useEffect(() => {
    if (fetchedValues) {
      form.reset(fetchedValues.values);
    }
  }, [fetchedValues, form]);

  return (
    <>
      {configuration.configurableArguments && (
        <Portal>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit((v) => updateValues.mutate(v))}>
              <Modal
                onClose={onClose}
                header={configuration.name}
                footer={
                  <fieldset>
                    <div className="flex flex-row justify-end">
                      <div className="flex gap-2">
                        <Button type="button" variant="subtle" onClick={onClose}>
                          {texts.common.cancel}
                        </Button>
                        <Button type="submit">{texts.common.save}</Button>
                      </div>
                    </div>
                  </fieldset>
                }
              >
                <div className="flex flex-col">
                  {Object.entries(configuration.configurableArguments?.properties ?? {}).map(([id, x]) => (
                    <>
                      {x.type === 'object' && (
                        <Fieldset
                          key={x.title}
                          legend={
                            <div className="flex items-center">
                              <h4 className="mr-2.5 font-bold">{x.title}</h4>
                              <p className="text-xs">{x.description}</p>
                            </div>
                          }
                        >
                          {Object.entries(x.properties).map(([name, spec]) => (
                            <Argument
                              namePrefix={`${id}.`}
                              refreshable
                              vertical
                              key={`${id}-${name}`}
                              buckets={[]}
                              name={name}
                              argument={spec}
                            />
                          ))}
                        </Fieldset>
                      )}
                    </>
                  ))}
                </div>
              </Modal>
            </form>
          </FormProvider>
        </Portal>
      )}
    </>
  );
}

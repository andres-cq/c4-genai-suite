import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Tabs } from '@mantine/core';
import { IconLock, IconUser } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { UpsertUserDto, useApi } from 'src/api';
import { FormAlert, Forms, Modal } from 'src/components';
import { useProfile } from 'src/hooks';
import { texts } from 'src/texts';

const PASSWORD_CHANGE_SCHEMA = Yup.object({
  currentPassword: Yup.string().label('Current Password').required(texts.common.required),
  password: Yup.string().label(texts.common.password).required(texts.common.required),
  passwordConfirm: Yup.string()
    .label(texts.common.passwordConfirm)
    .oneOf([Yup.ref('password'), '', undefined], texts.common.passwordsDoNotMatch)
    .required(texts.common.required),
});

const PASSWORD_RESOLVER = yupResolver<any>(PASSWORD_CHANGE_SCHEMA);
interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const profile = useProfile();
  const api = useApi();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');

  const passwordForm = useForm<{ currentPassword?: string; password?: string; passwordConfirm?: string }>({
    resolver: PASSWORD_RESOLVER,
    defaultValues: { currentPassword: '', password: '', passwordConfirm: '' },
  });

  const updatePassword = useMutation({
    mutationFn: async (request: { currentPassword?: string; password?: string }) => {
      const fullUserData = await api.users.getUser(profile.id);

      const updateData: UpsertUserDto = {
        name: fullUserData.name,
        email: fullUserData.email,
        userGroupId: fullUserData.userGroupId,
        password: request.password,
        apiKey: fullUserData.apiKey,
        currentPassword: request.currentPassword,
      };
      return api.users.putUser(profile.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
      passwordForm.reset({ password: '', passwordConfirm: '' });
    },
    onError: () => {
      toast.error(texts.users.updateFailed);
    },
  });

  const handlePasswordSubmit = (data: { currentPassword?: string; password?: string; passwordConfirm?: string }) => {
    if (data.password) {
      updatePassword.mutate({ password: data.password, currentPassword: data.currentPassword });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      passwordForm.reset({ password: '', passwordConfirm: '' });
      updatePassword.reset();
    }
  }, [isOpen, passwordForm]);

  if (!isOpen) {
    return null;
  }

  const PersonalInfoSection = () => (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Personal Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
        </div>
      </div>
    </div>
  );

  const SecuritySection = () => (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Security</h3>
      <FormProvider {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
          <FormAlert common={texts.users.updateFailed} error={updatePassword.error} />

          {updatePassword.isSuccess && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-700">Password updated successfully!</p>
            </div>
          )}

          <div className="space-y-4">
            <Forms.Password name="currentPassword" label="Current Password" placeholder="Enter current password" />
            <Forms.Password name="password" label={texts.common.password} placeholder="Enter new password" />
            <Forms.Password name="passwordConfirm" label={texts.common.passwordConfirm} placeholder="Confirm new password" />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={updatePassword.isPending}>
              {updatePassword.isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );

  return (
    <Modal header={<div className="flex items-center gap-4">User Information</div>} onClose={onClose}>
      <div className="flex h-96">
        <div className="w-1/3 border-r border-gray-200 pr-4">
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value as 'personal' | 'security')} orientation="vertical">
            <Tabs.List>
              <Tabs.Tab value="personal" leftSection={<IconUser size={16} />}>
                Personal Information
              </Tabs.Tab>
              <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
                Security
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>

        <div className="w-2/3 pl-4">
          {activeTab === 'personal' && <PersonalInfoSection />}
          {activeTab === 'security' && <SecuritySection />}
        </div>
      </div>
    </Modal>
  );
}

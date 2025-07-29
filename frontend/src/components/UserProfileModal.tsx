import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import { Modal, Forms, FormAlert } from 'src/components';
import { useProfile } from 'src/hooks';
import { useApi, UpsertUserDto } from 'src/api';
import { texts } from 'src/texts';
import { toast } from 'react-toastify';

const PASSWORD_CHANGE_SCHEMA = Yup.object({
  password: Yup.string().label(texts.common.password),
  passwordConfirm: Yup.string()
    .label(texts.common.passwordConfirm)
    .oneOf([Yup.ref('password'), '', undefined], texts.common.passwordsDoNotMatch),
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
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'settings'>('personal');

  const passwordForm = useForm<{ password?: string; passwordConfirm?: string }>({
    resolver: PASSWORD_RESOLVER,
    defaultValues: { password: '', passwordConfirm: '' }
  });

  const updatePassword = useMutation({
    mutationFn: async (request: { password?: string }) => {
      const fullUserData = await api.users.getUser(profile.id);
      
      const updateData: UpsertUserDto = {
        name: fullUserData.name,
        email: fullUserData.email,
        userGroupId: fullUserData.userGroupId,
        password: request.password,
        apiKey: fullUserData.apiKey
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
    }
  });

  const handlePasswordSubmit = (data: { password?: string; passwordConfirm?: string }) => {
    if (data.password) {
      updatePassword.mutate({ password: data.password });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal header="User Information" onClose={onClose}>
      <div className="flex h-96">
        <div className="w-1/3 border-r border-gray-200 pr-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('personal')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'personal'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'security'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="w-2/3 pl-4">
          {activeTab === 'personal' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
              <FormProvider {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                  <FormAlert 
                    common={texts.users.updateFailed} 
                    error={updatePassword.error} 
                  />
                  
                  {updatePassword.isSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <p className="text-sm text-green-700">Password updated successfully!</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Forms.Password 
                      name="password" 
                      label={texts.common.password}
                      placeholder="Enter new password"
                    />
                    
                    <Forms.Password 
                      name="passwordConfirm" 
                      label={texts.common.passwordConfirm}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={updatePassword.isPending}
                      className="btn btn-primary"
                    >
                      {updatePassword.isPending ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 italic">
                  User settings and preferences will be available here soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

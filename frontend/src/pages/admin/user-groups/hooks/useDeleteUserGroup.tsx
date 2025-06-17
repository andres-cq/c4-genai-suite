import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AppClient, UserGroupDto } from 'src/api';
import { buildError } from 'src/lib';
import { texts } from 'src/texts';

export function useDeleteUserGroup(api: AppClient, target: UserGroupDto, onDelete: (id: string) => void, onClose: () => void) {
  const { mutate, error, isPending } = useMutation({
    mutationFn: () => {
      return api.users.deleteUserGroup(target.id);
    },
    onSuccess: () => {
      onDelete(target.id);
      onClose();
    },
    onError: async (error) => {
      toast.error(await buildError(texts.userGroups.removeUserGroupFailed, error));
    },
  });
  return { mutate, error, isPending };
}

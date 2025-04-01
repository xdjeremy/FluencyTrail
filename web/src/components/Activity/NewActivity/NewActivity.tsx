import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type {
  CreateActivityInput,
  CreateActivityMutation,
  CreateActivityMutationVariables,
} from 'types/graphql';

import type { TypedDocumentNode } from '@redwoodjs/web';
import { useMutation } from '@redwoodjs/web';

import { Button } from 'src/components/ui/button';
import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';

import ActivityForm from '../ActivityForm';

const CREATE_ACTIVITY_MUTATION: TypedDocumentNode<
  CreateActivityMutation,
  CreateActivityMutationVariables
> = gql`
  mutation CreateActivityMutation($input: CreateActivityInput!) {
    createActivity(input: $input) {
      activityType
      date
      duration
      notes
    }
  }
`;

const NewActivity = () => {
  const { setActivityModalOpen } = useActivityModal();

  const [createActivity, { loading, error }] = useMutation(
    CREATE_ACTIVITY_MUTATION,
    {
      onCompleted: () => {
        toast.success('Activity created');
        setActivityModalOpen(false);
        // navigate(routes.activities());
      },
      onError: error => {
        toast.error(error.message);
      },
    }
  );

  const onSave = (input: CreateActivityInput) => {
    createActivity({ variables: { input } });
  };

  return (
    <>
      <Button
        onClick={() => setActivityModalOpen(true)}
        className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full text-white shadow-lg dark:text-neutral-900"
        aria-label="Quick add activity"
      >
        <Plus className="h-6 w-6" />
      </Button>
      <ActivityForm onSave={onSave} loading={loading} error={error} />
    </>
  );
};

export default NewActivity;

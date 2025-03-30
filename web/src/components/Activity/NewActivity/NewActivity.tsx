import type {
  CreateActivityInput,
  CreateActivityMutation,
  CreateActivityMutationVariables,
} from 'types/graphql';

import { navigate, routes } from '@redwoodjs/router';
import type { TypedDocumentNode } from '@redwoodjs/web';
import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';

import { Plus } from 'lucide-react';
import { Button } from 'src/components/ui/button';
import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';

const CREATE_ACTIVITY_MUTATION: TypedDocumentNode<
  CreateActivityMutation,
  CreateActivityMutationVariables
> = gql`
  mutation CreateActivityMutation($input: CreateActivityInput!) {
    createActivity(input: $input) {
      id
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
        navigate(routes.activities());
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
      {/* <AddActivityModal /> */}
    </>
    // <div className="rw-segment">
    //   <header className="rw-segment-header">
    //     <h2 className="rw-heading rw-heading-secondary">New Activity</h2>
    //   </header>
    //   <div className="rw-segment-main">
    //     <ActivityForm onSave={onSave} loading={loading} error={error} />
    //   </div>
    // </div>
  );
};

export default NewActivity;

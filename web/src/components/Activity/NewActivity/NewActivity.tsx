import { Plus } from 'lucide-react';
import { useReward } from 'react-rewards';
import { toast } from 'sonner';
import type {
  CreateActivityInput,
  CreateActivityMutation,
  CreateActivityMutationVariables,
  Language, // Import Language type
} from 'types/graphql';

import type { TypedDocumentNode } from '@redwoodjs/web';
import { useMutation } from '@redwoodjs/web';

import { Button } from 'src/components/ui/button';
import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';

import ActivityForm from '../ActivityForm';

// Define props for NewActivity
interface NewActivityProps {
  userLanguages?: Pick<Language, 'id' | 'name'>[];
  primaryLanguageId?: number;
  isLoadingLanguages?: boolean; // To disable button while loading
}

const CREATE_ACTIVITY_MUTATION: TypedDocumentNode<
  CreateActivityMutation,
  CreateActivityMutationVariables
> = gql`
  mutation CreateActivityMutation($input: CreateActivityInput!) {
    createActivity(input: $input) {
      activityType
      date
      notes
      duration
    }
  }
`;

const NewActivity = ({
  userLanguages,
  primaryLanguageId,
  isLoadingLanguages = false, // Default to false
}: NewActivityProps) => {
  const { setActivityModalOpen } = useActivityModal();
  const { reward } = useReward('rewardId', 'confetti', {
    elementCount: 150,
    startVelocity: 60,
  });

  const [createActivity, { loading, error }] = useMutation(
    CREATE_ACTIVITY_MUTATION,
    {
      onCompleted: () => {
        toast.success('Activity created');
        setActivityModalOpen(false);
        reward();
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
        disabled={isLoadingLanguages} // Disable if languages are loading
      >
        <Plus className="h-6 w-6" />
      </Button>
      <span id="rewardId" className="fixed bottom-0 right-1/2" />
      <ActivityForm
        onSave={onSave}
        loading={loading}
        error={error}
        userLanguages={userLanguages}
        primaryLanguageId={primaryLanguageId}
      />
    </>
  );
};

export default NewActivity;

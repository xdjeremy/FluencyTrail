import { useReward } from 'react-rewards';
import { toast } from 'sonner';
import type {
  CreateActivityInput,
  CreateActivityMutation,
  CreateActivityMutationVariables,
} from 'types/graphql';

import type { TypedDocumentNode } from '@redwoodjs/web';
import { useMutation } from '@redwoodjs/web';

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
      notes
      duration
    }
  }
`;

const NewActivity = () => {
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
      <ActivityForm onSave={onSave} loading={loading} error={error} />
    </>
  );
};

export default NewActivity;

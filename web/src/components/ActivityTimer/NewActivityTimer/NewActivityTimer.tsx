import { toast } from 'sonner';
import {
  StartActivityTimer,
  StartActivityTimerVariables,
  StartTimerInput,
} from 'types/graphql';

import { TypedDocumentNode, useMutation } from '@redwoodjs/web';

import { useActivityModal } from 'src/layouts/ProvidersLayout/Providers/ActivityProvider';

import ActivityTimerForm from '../ActivityTimerForm/ActivityTimerForm';

const CREATE_TIMER_MUTATION: TypedDocumentNode<
  StartActivityTimer,
  StartActivityTimerVariables
> = gql`
  mutation StartActivityTimer($input: StartTimerInput!) {
    startActivityTimer(input: $input) {
      id
    }
  }
`;

const NewActivityTimer = () => {
  const { setActivityTimerModalOpen } = useActivityModal();

  const [startActivityTimer, { loading, error }] = useMutation(
    CREATE_TIMER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Timer started');
        setActivityTimerModalOpen(false);
      },
      onError: error => {
        toast.error(error.message);
      },
      refetchQueries: [
        'GetActivityTimerForHeader',
        'GetActiveTimerForQuickAdd',
      ],
    }
  );

  const submitHandler = (input: StartTimerInput) => {
    startActivityTimer({ variables: { input } });
  };

  return (
    <ActivityTimerForm
      onSubmit={submitHandler}
      mutationLoading={loading}
      error={error}
    />
  );
};

export default NewActivityTimer;

import {
  FetchLanguagesForOnboarding,
  FetchLanguagesForOnboardingVariables,
} from 'types/graphql';

import { TypedDocumentNode, useQuery } from '@redwoodjs/web';

import { useAuth } from 'src/auth';

import LanguageSelectionPopup from './LanguageSelectionPopup';

const FETCH_LANGUAGES_FOR_ONBOARDING: TypedDocumentNode<
  FetchLanguagesForOnboarding,
  FetchLanguagesForOnboardingVariables
> = gql`
  query FetchLanguagesForOnboarding {
    languages: languages {
      name
      code
      id
      nativeName
    }
    user {
      languages {
        code
        id
      }
    }
  }
`;

const Onboarding = () => {
  const { data, error } = useQuery(FETCH_LANGUAGES_FOR_ONBOARDING, {
    fetchPolicy: 'cache-and-network',
  });

  const { currentUser } = useAuth();

  // only load the popup if:
  if (
    data && // there is data
    currentUser && // the user is logged in
    !error && // there is no error
    data.user?.languages.length < 1 // the user does not have a language
  ) {
    return <LanguageSelectionPopup data={data} />;
  }

  // if the user is not logged in, or if the user has a primary language, return null
  return null;
};

export default Onboarding;

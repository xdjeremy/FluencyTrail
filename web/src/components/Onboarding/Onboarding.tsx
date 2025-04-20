import {
  FetchLanguagesForOnboarding,
  FetchLanguagesForOnboardingVariables,
} from 'types/graphql';

import { TypedDocumentNode, useQuery } from '@redwoodjs/web';

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
    }
  }
`;

const Onboarding = () => {
  const { data, error } = useQuery(FETCH_LANGUAGES_FOR_ONBOARDING, {
    fetchPolicy: 'cache-and-network',
  });

  // TODO: add checks if user already selected a language

  if (error) {
    return null; // or handle the error as needed
  }

  // only load the popup if the data is available
  if (data) {
    return <LanguageSelectionPopup data={data} />;
  }
};

export default Onboarding;

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ConfirmedForeignNational = {
  __typename?: 'ConfirmedForeignNational';
  coordinates: Coordinates;
  case_id: Scalars['String'];
  age: Scalars['Float'];
  nationality: Scalars['String'];
  travel_date: Scalars['String'];
  travel_history: Scalars['String'];
  date_confirmed: Scalars['String'];
  where_now: Scalars['String'];
  status?: Maybe<Scalars['String']>;
};

export type ConfirmedOfw = {
  __typename?: 'ConfirmedOFW';
  coordinates: Coordinates;
  case_id: Scalars['String'];
  age: Scalars['Float'];
  sex: Scalars['String'];
  country: Scalars['String'];
  date_reported: Scalars['String'];
  date_confirmed: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
};

export type ConfirmedPerHealthFacility = {
  __typename?: 'ConfirmedPerHealthFacility';
  coordinates: Coordinates;
  facility: Scalars['String'];
  count: Scalars['Float'];
};

export type ConfirmedPerResidence = {
  __typename?: 'ConfirmedPerResidence';
  count: Scalars['Float'];
  residence: Scalars['String'];
};

export type Coordinates = {
  __typename?: 'Coordinates';
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
};

export type Counts = {
  __typename?: 'Counts';
  day: Scalars['Float'];
  confirmed: Scalars['Float'];
  PUIs: Scalars['Float'];
  PUMs: Scalars['Float'];
  recovered: Scalars['Float'];
  deaths: Scalars['Float'];
  tests: Scalars['Float'];
};

export type Facility = {
  __typename?: 'Facility';
  coordinates: Coordinates;
  name?: Maybe<Scalars['String']>;
};

export type ICoordinates = {
  __typename?: 'ICoordinates';
  coordinates: Coordinates;
};

export type Patient = {
  __typename?: 'Patient';
  id: Scalars['ID'];
  case_id: Scalars['String'];
  nationality?: Maybe<Array<Scalars['String']>>;
  date_confirmed?: Maybe<Scalars['String']>;
  date_reported?: Maybe<Scalars['String']>;
  date_recovered?: Maybe<Scalars['String']>;
  date_deceased?: Maybe<Scalars['String']>;
  age?: Maybe<Scalars['Float']>;
  sex?: Maybe<Scalars['String']>;
  residence?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  facility?: Maybe<Facility>;
  symptoms?: Maybe<Array<Scalars['String']>>;
  travel_history?: Maybe<Array<Scalars['String']>>;
  relationships?: Maybe<Relationships>;
};

export type PuiPerHealthFacility = {
  __typename?: 'PUIPerHealthFacility';
  coordinates: Coordinates;
  region: Scalars['String'];
  facility: Scalars['String'];
  count: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  confirmedLocals: Array<Patient>;
  counts: Counts;
  confirmedPerHealthFacility: Array<ConfirmedPerHealthFacility>;
  puisPerHealthFacility: Array<PuiPerHealthFacility>;
  confirmedPerResidence: Array<ConfirmedPerResidence>;
  confirmedOFWs: Array<ConfirmedOfw>;
  confirmedForeignNationals: Array<ConfirmedForeignNational>;
};

export type Relationships = {
  __typename?: 'Relationships';
  wife?: Maybe<Patient>;
  husband?: Maybe<Patient>;
  mother?: Maybe<Patient>;
  father?: Maybe<Patient>;
  children?: Maybe<Array<Patient>>;
  siblings?: Maybe<Array<Sibling>>;
  nieces?: Maybe<Array<Patient>>;
  nephews?: Maybe<Array<Patient>>;
  contacts?: Maybe<Array<Patient>>;
  relatives?: Maybe<Array<Patient>>;
  householdMembers?: Maybe<Array<Patient>>;
  exposures?: Maybe<Array<Patient>>;
};

export type Sibling = {
  __typename?: 'Sibling';
  relationship?: Maybe<Scalars['String']>;
  sibling?: Maybe<Patient>;
};

export type PatientAttributesFragment = { __typename: 'Patient' } & Pick<
  Patient,
  | 'id'
  | 'case_id'
  | 'residence'
  | 'nationality'
  | 'date_confirmed'
  | 'date_reported'
  | 'date_recovered'
  | 'date_deceased'
  | 'age'
  | 'sex'
  | 'status'
  | 'symptoms'
  | 'travel_history'
> & {
    facility?: Maybe<
      { __typename?: 'Facility' } & Pick<Facility, 'name'> & {
          coordinates: { __typename?: 'Coordinates' } & Pick<Coordinates, 'lng' | 'lat'>;
        }
    >;
  };

export type ConfirmedLocalsQueryVariables = {};

export type ConfirmedLocalsQuery = { __typename?: 'Query' } & {
  confirmedLocals: Array<
    { __typename?: 'Patient' } & {
      relationships?: Maybe<
        { __typename?: 'Relationships' } & {
          wife?: Maybe<{ __typename?: 'Patient' } & PatientAttributesFragment>;
          husband?: Maybe<{ __typename?: 'Patient' } & PatientAttributesFragment>;
          mother?: Maybe<{ __typename?: 'Patient' } & PatientAttributesFragment>;
          father?: Maybe<{ __typename?: 'Patient' } & PatientAttributesFragment>;
          children?: Maybe<Array<{ __typename?: 'Patient' } & PatientAttributesFragment>>;
          siblings?: Maybe<
            Array<
              { __typename?: 'Sibling' } & Pick<Sibling, 'relationship'> & {
                  sibling?: Maybe<{ __typename?: 'Patient' } & PatientAttributesFragment>;
                }
            >
          >;
          nieces?: Maybe<Array<{ __typename?: 'Patient' } & PatientAttributesFragment>>;
          nephews?: Maybe<Array<{ __typename?: 'Patient' } & PatientAttributesFragment>>;
          contacts?: Maybe<Array<{ __typename?: 'Patient' } & PatientAttributesFragment>>;
          relatives?: Maybe<Array<{ __typename?: 'Patient' } & PatientAttributesFragment>>;
          householdMembers?: Maybe<Array<{ __typename?: 'Patient' } & PatientAttributesFragment>>;
          exposures?: Maybe<Array<{ __typename?: 'Patient' } & PatientAttributesFragment>>;
        }
      >;
    } & PatientAttributesFragment
  >;
};

export const PatientAttributesFragmentDoc = gql`
  fragment PatientAttributes on Patient {
    id
    case_id
    residence
    nationality
    date_confirmed
    date_reported
    date_recovered
    date_deceased
    age
    sex
    status
    facility {
      name
      coordinates {
        lng
        lat
      }
    }
    symptoms
    travel_history
    __typename
  }
`;
export const ConfirmedLocalsDocument = gql`
  query ConfirmedLocals {
    confirmedLocals {
      ...PatientAttributes
      relationships {
        wife {
          ...PatientAttributes
        }
        husband {
          ...PatientAttributes
        }
        mother {
          ...PatientAttributes
        }
        father {
          ...PatientAttributes
        }
        children {
          ...PatientAttributes
        }
        siblings {
          sibling {
            ...PatientAttributes
          }
          relationship
        }
        nieces {
          ...PatientAttributes
        }
        nephews {
          ...PatientAttributes
        }
        contacts {
          ...PatientAttributes
        }
        relatives {
          ...PatientAttributes
        }
        householdMembers {
          ...PatientAttributes
        }
        exposures {
          ...PatientAttributes
        }
      }
    }
  }
  ${PatientAttributesFragmentDoc}
`;

/**
 * __useConfirmedLocalsQuery__
 *
 * To run a query within a React component, call `useConfirmedLocalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useConfirmedLocalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConfirmedLocalsQuery({
 *   variables: {
 *   },
 * });
 */
export function useConfirmedLocalsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ConfirmedLocalsQuery,
    ConfirmedLocalsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<ConfirmedLocalsQuery, ConfirmedLocalsQueryVariables>(
    ConfirmedLocalsDocument,
    baseOptions
  );
}
export function useConfirmedLocalsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ConfirmedLocalsQuery,
    ConfirmedLocalsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<ConfirmedLocalsQuery, ConfirmedLocalsQueryVariables>(
    ConfirmedLocalsDocument,
    baseOptions
  );
}
export type ConfirmedLocalsQueryHookResult = ReturnType<typeof useConfirmedLocalsQuery>;
export type ConfirmedLocalsLazyQueryHookResult = ReturnType<typeof useConfirmedLocalsLazyQuery>;
export type ConfirmedLocalsQueryResult = ApolloReactCommon.QueryResult<
  ConfirmedLocalsQuery,
  ConfirmedLocalsQueryVariables
>;

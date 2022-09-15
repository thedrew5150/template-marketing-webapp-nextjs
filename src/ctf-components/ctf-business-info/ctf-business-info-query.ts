import gql from 'graphql-tag';
import { componentReferenceFragment } from '@ctf-components/fragments';
import { assetFragment } from '../ctf-asset/ctf-asset-query';

export const contentFragment = gql`
  fragment BusinessInfoFragment on TopicBusinessInfo {
    sys {
      id
    }
    name
    shortDescription
    featuredImage {
      ...AssetFragment
    }
    body {
      json
      links {
        entries {
          block {
            ...ComponentReferenceFragment
          }
        }
        assets {
          block {
            ...AssetFragment
          }
        }
      }
    }
  }
  ${assetFragment}
  ${componentReferenceFragment}
`;

export const query = gql`
  query CtfBusinessInfoQuery($id: String!, $locale: String, $preview: Boolean) {
    topicBusinessInfo(id: $id, preview: $preview, locale: $locale) {
      ...BusinessInfoFragment
    }
  }
  ${contentFragment}
`;
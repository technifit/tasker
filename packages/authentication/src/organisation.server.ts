import type {
  CreateOrganizationMembershipOptions,
  CreateOrganizationOptions,
  ListOrganizationMembershipsOptions,
} from '@workos-inc/node';

import { authentication } from './authentication-provider.server';

const createOrganisation = async ({ name, domainData }: CreateOrganizationOptions) =>
  authentication.organizations.createOrganization({ name, domainData });

const createOrgnisationMembership = async ({ organizationId, userId, roleSlug }: CreateOrganizationMembershipOptions) =>
  authentication.userManagement.createOrganizationMembership({
    organizationId,
    userId,
    roleSlug,
  });

const listOrgnisationMemberships = async ({ userId }: Pick<ListOrganizationMembershipsOptions, 'userId'>) =>
  authentication.userManagement.listOrganizationMemberships({
    userId,
  });

const getOrganisation = async (organisationId: string) => authentication.organizations.getOrganization(organisationId);

export { createOrganisation, createOrgnisationMembership, getOrganisation, listOrgnisationMemberships };

import type { CreateOrganizationMembershipOptions, CreateOrganizationOptions } from '@workos-inc/node';

import { authentication } from './authentication-provider';

const createOrganisation = async ({ name, domainData }: CreateOrganizationOptions) =>
  authentication.organizations.createOrganization({ name, domainData });

const createOrgnisationMembership = async ({ organizationId, userId, roleSlug }: CreateOrganizationMembershipOptions) =>
  authentication.userManagement.createOrganizationMembership({
    organizationId,
    userId,
    roleSlug,
  });

const getOrganisation = async (organisationId: string) => authentication.organizations.getOrganization(organisationId);

export { createOrganisation, createOrgnisationMembership, getOrganisation };

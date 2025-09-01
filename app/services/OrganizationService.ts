import { v4 as uuidv4 } from 'uuid';
import {
  ORGANIZATION_SUBSCRIPTION_PLANS,
  calculateSubscriptionCost,
  getDefaultPlanForType,
} from '../config/subscriptionPlans';
import {
  Organization,
  OrganizationCreationParams,
  OrganizationSubscriptionUpdate,
  OrganizationUpdateParams,
} from '../models/Organization';
import {
  AddUserToOrganizationParams,
  InviteUserToOrganizationParams,
  OrganizationInvitation,
  OrganizationUser,
  ROLE_PERMISSIONS,
  UpdateUserRoleParams,
} from '../models/OrganizationUser';

// Mock database implementation (replace with actual database connection)
class MockDatabase {
  private organizations: Organization[] = [];
  private organizationUsers: OrganizationUser[] = [];
  private organizationInvitations: OrganizationInvitation[] = [];
  private users: any[] = [];

  // Organizations
  async createOrganization(data: Organization): Promise<Organization> {
    this.organizations.push(data);
    return data;
  }

  async getOrganization(id: string): Promise<Organization | null> {
    return this.organizations.find((org) => org.id === id) || null;
  }

  async updateOrganization(
    id: string,
    updates: Partial<Organization>
  ): Promise<Organization | null> {
    const index = this.organizations.findIndex((org) => org.id === id);
    if (index === -1) return null;

    this.organizations[index] = {
      ...this.organizations[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.organizations[index];
  }

  async deleteOrganization(id: string): Promise<boolean> {
    const index = this.organizations.findIndex((org) => org.id === id);
    if (index === -1) return false;

    this.organizations.splice(index, 1);
    return true;
  }

  async listUserOrganizations(userId: string): Promise<Organization[]> {
    const userOrgIds = this.organizationUsers
      .filter((ou) => ou.userId === userId && ou.active)
      .map((ou) => ou.organizationId);

    return this.organizations.filter((org) => userOrgIds.includes(org.id));
  }

  // Organization Users
  async addUserToOrganization(
    data: OrganizationUser
  ): Promise<OrganizationUser> {
    this.organizationUsers.push(data);
    return data;
  }

  async getOrganizationUsers(
    organizationId: string
  ): Promise<OrganizationUser[]> {
    return this.organizationUsers.filter(
      (ou) => ou.organizationId === organizationId && ou.active
    );
  }

  async getUserOrganizationRole(
    userId: string,
    organizationId: string
  ): Promise<OrganizationUser | null> {
    return (
      this.organizationUsers.find(
        (ou) =>
          ou.userId === userId &&
          ou.organizationId === organizationId &&
          ou.active
      ) || null
    );
  }

  async updateUserRole(
    organizationId: string,
    userId: string,
    role: OrganizationUser['role'],
    permissions: string[]
  ): Promise<OrganizationUser | null> {
    const index = this.organizationUsers.findIndex(
      (ou) => ou.userId === userId && ou.organizationId === organizationId
    );

    if (index === -1) return null;

    this.organizationUsers[index] = {
      ...this.organizationUsers[index],
      role,
      permissions,
      updatedAt: new Date(),
    };

    return this.organizationUsers[index];
  }

  async removeUserFromOrganization(
    organizationId: string,
    userId: string
  ): Promise<boolean> {
    const index = this.organizationUsers.findIndex(
      (ou) => ou.userId === userId && ou.organizationId === organizationId
    );

    if (index === -1) return false;

    this.organizationUsers.splice(index, 1);
    return true;
  }

  // Invitations
  async createInvitation(
    data: OrganizationInvitation
  ): Promise<OrganizationInvitation> {
    this.organizationInvitations.push(data);
    return data;
  }

  async getInvitationByToken(
    token: string
  ): Promise<OrganizationInvitation | null> {
    return (
      this.organizationInvitations.find((inv) => inv.token === token) || null
    );
  }

  async updateInvitationStatus(
    id: string,
    status: OrganizationInvitation['status']
  ): Promise<OrganizationInvitation | null> {
    const index = this.organizationInvitations.findIndex(
      (inv) => inv.id === id
    );
    if (index === -1) return null;

    this.organizationInvitations[index] = {
      ...this.organizationInvitations[index],
      status,
      updatedAt: new Date(),
    };

    return this.organizationInvitations[index];
  }

  async listOrganizationInvitations(
    organizationId: string
  ): Promise<OrganizationInvitation[]> {
    return this.organizationInvitations.filter(
      (inv) => inv.organizationId === organizationId
    );
  }

  // Users
  async getUserById(id: string): Promise<any | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<any | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async createUser(data: any): Promise<any> {
    const user = { ...data, id: uuidv4() };
    this.users.push(user);
    return user;
  }

  async updateUser(id: string, updates: any): Promise<any | null> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }
}

const db = new MockDatabase();

export class OrganizationService {
  /**
   * Create a new organization
   */
  async createOrganization(
    params: OrganizationCreationParams
  ): Promise<Organization> {
    const defaultPlan = getDefaultPlanForType(params.type);
    const seatsTotal =
      ORGANIZATION_SUBSCRIPTION_PLANS[defaultPlan].includedSeats;
    const price = calculateSubscriptionCost(defaultPlan, seatsTotal);

    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const organization: Organization = {
      id: uuidv4(),
      name: params.name,
      type: params.type,
      subscription: {
        plan: defaultPlan,
        seats: {
          total: seatsTotal,
          used: 0,
          available: seatsTotal,
        },
        billingCycle: 'monthly',
        price,
        nextBillingDate,
      },
      billing: {
        contactName: params.billing.contactName,
        contactEmail: params.billing.contactEmail,
        squareCustomerId: '', // Will be set when subscription is created
      },
      mcNumber: params.mcNumber,
      dispatchFeePercentage: params.dispatchFeePercentage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await db.createOrganization(organization);
  }

  /**
   * Get organization by ID
   */
  async getOrganization(id: string): Promise<Organization | null> {
    return await db.getOrganization(id);
  }

  /**
   * Update organization
   */
  async updateOrganization(
    id: string,
    updates: OrganizationUpdateParams
  ): Promise<Organization | null> {
    const updateData: Partial<Organization> = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.billing) {
      updateData.billing = {
        ...updateData.billing,
        ...updates.billing,
      };
    }
    if (updates.mcNumber !== undefined) updateData.mcNumber = updates.mcNumber;
    if (updates.dispatchFeePercentage !== undefined)
      updateData.dispatchFeePercentage = updates.dispatchFeePercentage;

    return await db.updateOrganization(id, updateData);
  }

  /**
   * Update organization subscription
   */
  async updateOrganizationSubscription(
    id: string,
    updates: OrganizationSubscriptionUpdate
  ): Promise<Organization | null> {
    const updateData: Partial<Organization> = {};

    if (
      updates.plan ||
      updates.seats ||
      updates.billingCycle ||
      updates.price ||
      updates.nextBillingDate
    ) {
      updateData.subscription = {
        plan: updates.plan || updateData.subscription?.plan || '',
        seats: updates.seats ||
          updateData.subscription?.seats || { total: 1, used: 1, available: 0 },
        billingCycle:
          updates.billingCycle ||
          updateData.subscription?.billingCycle ||
          'monthly',
        price: updates.price || updateData.subscription?.price || 0,
        nextBillingDate:
          updates.nextBillingDate ||
          updateData.subscription?.nextBillingDate ||
          new Date(),
      };
    }

    return await db.updateOrganization(id, updateData);
  }

  /**
   * Delete organization
   */
  async deleteOrganization(id: string): Promise<boolean> {
    return await db.deleteOrganization(id);
  }

  /**
   * Get all organizations for a user
   */
  async getUserOrganizations(userId: string): Promise<Organization[]> {
    return await db.listUserOrganizations(userId);
  }

  /**
   * Add user to organization
   */
  async addUserToOrganization(
    params: AddUserToOrganizationParams
  ): Promise<OrganizationUser> {
    const organizationUser: OrganizationUser = {
      id: uuidv4(),
      userId: params.userId,
      organizationId: params.organizationId,
      role: params.role,
      permissions:
        params.permissions.length > 0
          ? params.permissions
          : ROLE_PERMISSIONS[params.role],
      active: true,
      invitedAt: new Date(),
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await db.addUserToOrganization(organizationUser);
  }

  /**
   * Get all users in an organization
   */
  async getOrganizationUsers(
    organizationId: string
  ): Promise<OrganizationUser[]> {
    return await db.getOrganizationUsers(organizationId);
  }

  /**
   * Get user's role in organization
   */
  async getUserOrganizationRole(
    userId: string,
    organizationId: string
  ): Promise<OrganizationUser | null> {
    return await db.getUserOrganizationRole(userId, organizationId);
  }

  /**
   * Update user's role in organization
   */
  async updateUserRole(
    params: UpdateUserRoleParams
  ): Promise<OrganizationUser | null> {
    const permissions =
      params.permissions.length > 0
        ? params.permissions
        : ROLE_PERMISSIONS[params.role];
    return await db.updateUserRole(
      params.organizationId,
      params.userId,
      params.role,
      permissions
    );
  }

  /**
   * Remove user from organization
   */
  async removeUserFromOrganization(
    organizationId: string,
    userId: string
  ): Promise<boolean> {
    return await db.removeUserFromOrganization(organizationId, userId);
  }

  /**
   * Invite user to organization
   */
  async inviteUserToOrganization(
    params: InviteUserToOrganizationParams
  ): Promise<OrganizationInvitation> {
    const token = this.generateInvitationToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation: OrganizationInvitation = {
      id: uuidv4(),
      organizationId: params.organizationId,
      email: params.email,
      role: params.role,
      permissions:
        params.permissions.length > 0
          ? params.permissions
          : ROLE_PERMISSIONS[params.role],
      token,
      expiresAt,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await db.createInvitation(invitation);
  }

  /**
   * Accept organization invitation
   */
  async acceptInvitation(
    token: string,
    userId: string
  ): Promise<{
    success: boolean;
    organization?: Organization;
    error?: string;
  }> {
    const invitation = await db.getInvitationByToken(token);

    if (!invitation) {
      return { success: false, error: 'Invalid invitation token' };
    }

    if (invitation.status !== 'pending') {
      return { success: false, error: 'Invitation has already been processed' };
    }

    if (invitation.expiresAt < new Date()) {
      await db.updateInvitationStatus(invitation.id, 'expired');
      return { success: false, error: 'Invitation has expired' };
    }

    // Check if user already has a role in this organization
    const existingRole = await db.getUserOrganizationRole(
      userId,
      invitation.organizationId
    );
    if (existingRole) {
      return {
        success: false,
        error: 'You are already a member of this organization',
      };
    }

    // Add user to organization
    await this.addUserToOrganization({
      userId,
      organizationId: invitation.organizationId,
      role: invitation.role,
      permissions: invitation.permissions,
    });

    // Update invitation status
    await db.updateInvitationStatus(invitation.id, 'accepted');

    // Get organization details
    const organization = await db.getOrganization(invitation.organizationId);

    return {
      success: true,
      organization: organization || undefined,
    };
  }

  /**
   * Get organization invitations
   */
  async getOrganizationInvitations(
    organizationId: string
  ): Promise<OrganizationInvitation[]> {
    return await db.listOrganizationInvitations(organizationId);
  }

  /**
   * Generate invitation token
   */
  private generateInvitationToken(): string {
    return uuidv4();
  }

  /**
   * Check if user has permission in organization
   */
  async userHasPermission(
    userId: string,
    organizationId: string,
    permission: string
  ): Promise<boolean> {
    const userRole = await db.getUserOrganizationRole(userId, organizationId);

    if (!userRole || !userRole.active) {
      return false;
    }

    // Owner has all permissions
    if (userRole.role === 'owner') {
      return true;
    }

    // Check specific permissions
    return (
      userRole.permissions.includes(permission) ||
      userRole.permissions.includes('*')
    );
  }

  /**
   * Check if user can perform action in organization
   */
  async userCanPerformAction(
    userId: string,
    organizationId: string,
    action: string
  ): Promise<boolean> {
    return await this.userHasPermission(userId, organizationId, action);
  }
}

// Export singleton instance
export const organizationService = new OrganizationService();


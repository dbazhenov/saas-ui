import { EditMemberFormFields } from 'pages/ManageOrganization/ManageOrganization.types';
import { OrgMember } from 'store/types';

export interface MemberEditModalProps {
  isVisible: boolean;
  member: OrgMember;
  onSubmit: (formData: EditMemberFormFields) => void;
  onClose: () => void;
}

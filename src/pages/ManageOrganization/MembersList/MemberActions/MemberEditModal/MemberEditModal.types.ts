import { EditMemberFormFields, Member } from '../../../ManageOrganization.types';

export interface MemberEditModalProps {
  isVisible: boolean;
  loading: boolean;
  member: Member;
  onSubmit: (formData: EditMemberFormFields) => Promise<void>;
  onClose: () => void;
}

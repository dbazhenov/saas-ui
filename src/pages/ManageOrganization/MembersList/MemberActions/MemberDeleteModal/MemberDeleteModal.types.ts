import { OrgMember } from 'store/types';

export interface MemberDeleteModalProps {
  member: OrgMember;
  isVisible: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

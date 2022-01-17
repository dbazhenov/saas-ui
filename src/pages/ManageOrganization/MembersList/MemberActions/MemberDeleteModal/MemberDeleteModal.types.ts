import { Member } from '../../../ManageOrganization.types';

export interface MemberDeleteModalProps {
  member: Member;
  isVisible: boolean;
  loading: boolean;
  onSubmit: () => Promise<void>;
  onClose: () => void;
}

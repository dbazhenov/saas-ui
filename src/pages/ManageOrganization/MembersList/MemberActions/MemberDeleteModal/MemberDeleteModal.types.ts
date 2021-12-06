export interface MemberDeleteModalProps {
  isVisible: boolean;
  loading: boolean;
  onSubmit: () => Promise<void>;
  onClose: () => void;
}

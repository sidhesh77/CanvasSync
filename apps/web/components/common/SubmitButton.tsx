import { Button } from "@workspace/ui/components/button";

const SubmitButton = ({
  children, pending, loadingText,
}: {
  children: React.ReactNode;
  pending: boolean;
  loadingText: string;
}) => {
  return (
    <Button type="submit" disabled={pending} className="w-full h-11 text-base font-semibold">
      {pending ? loadingText : children}
    </Button>
  );
};

export default SubmitButton;
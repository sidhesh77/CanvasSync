import { Button } from "@workspace/ui/components/button";

const StateButton = ({
  children,
  onClick,
  value,
  variant,
}: {
  children: React.ReactNode;
  onClick: (value: "meetdraws" | "create-room" | "join-room" | "chat") => void;
  value: "meetdraws" | "create-room" | "join-room" | "chat";
  variant?: "primary" | "secondary";
}) => {
  return (
    <Button
      type="button"
      onClick={() => onClick(value)}
      variant={variant === "secondary" ? "outline" : "default"}
      size="sm"
    >
      {children}
    </Button>
  );
};

export default StateButton;
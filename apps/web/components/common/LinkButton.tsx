import Link from "next/link";

const LinkButton = ({
  href, children, variant = "ghost",
}: {
  href: string; children: React.ReactNode; variant?: "ghost" | "outline" | "default";
}) => {
  return (
    <Link href={href} className="text-sm font-medium text-primary hover:underline">
      {children}
    </Link>
  );
};

export default LinkButton;
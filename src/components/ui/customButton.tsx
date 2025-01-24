import Link, { LinkProps } from "next/link";
import clsx from "clsx";

type ButtonLinkProps = LinkProps & {
  className?: string;
  children: React.ReactNode;
};

export default function ButtonLink({
  className,
  children,
  ...restProps
}: ButtonLinkProps) {
  return (
    <Link
      className={clsx(
        "relative inline-flex h-fit w-fit rounded-full border border-primary px-4 py-2 text-card outline-none ring-primary/50 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-primary/80 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-primary-200/40 hover:text-primary/30 after:hover:bg-opacity-15 focus:ring-2",
        className
      )}
      {...restProps}
    >
      {children}
    </Link>
  );
}

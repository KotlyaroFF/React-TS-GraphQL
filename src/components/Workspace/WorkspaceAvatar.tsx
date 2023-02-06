import { FC, ReactNode } from "react";

export interface AvatarProps {
  className?: string;
  children: ReactNode | string;
}

const WorkspaceAvatar: FC<AvatarProps> = ({ className, children }) => (
  <div className={className ?? ""}>
    <span className="inline-flex w-full h-full items-center justify-center rounded-full bg-indigo-600">
      <span className="text-sm font-medium leading-none text-white">
        {children}
      </span>
    </span>
  </div>
);
export default WorkspaceAvatar;

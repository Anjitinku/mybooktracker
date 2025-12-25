// Import NavLink from React Router (renamed to avoid naming conflict)
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
// Import forwardRef for ref forwarding
import { forwardRef } from "react";
// Import utility function for merging class names
import { cn } from "@/lib/utils";

// Define props interface extending React Router's NavLinkProps
// Omit className since we handle it differently
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string; // Base class name for the link
  activeClassName?: string; // Class name applied when link is active
  pendingClassName?: string; // Class name applied when navigation is pending
}

// NavLink component - wrapper around React Router's NavLink with class name utilities
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    // Render the React Router NavLink with custom className function
    return (
      <RouterNavLink
        ref={ref} // Forward the ref to the underlying anchor element
        to={to} // The destination path
        // className accepts a function that receives navigation state
        className={({ isActive, isPending }) =>
          // Merge base className with conditional active/pending classes
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props} // Spread remaining props (children, onClick, etc.)
      />
    );
  },
);

// Set display name for React DevTools
NavLink.displayName = "NavLink";

// Export NavLink component as named export
export { NavLink };

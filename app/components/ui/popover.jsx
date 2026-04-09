"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef(function PopoverContent({ className, align = "end", sideOffset = 8, ...props }, ref) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-80 rounded-xl border border-white/15 bg-[#141b30] p-4 text-sm text-white shadow-lg",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});

export { Popover, PopoverTrigger, PopoverContent };
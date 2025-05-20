import * as React from "react";
import { ChangeEvent, ComponentProps, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends ComponentProps<"textarea"> {
  maxLength?: number;
}

function Textarea({ className, maxLength, value, defaultValue, ...props }: TextareaProps) {
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setCharCount(String(value).length);
    } else if (defaultValue !== undefined) {
      setCharCount(String(defaultValue).length);
    }
  }, [value, defaultValue]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    props.onChange?.(e);
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        data-slot="textarea"
        className={cn(
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 !w-full resize-none rounded-md border bg-transparent px-3 pt-2 pb-6 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        maxLength={maxLength}
        onChange={handleChange}
        value={value}
        defaultValue={defaultValue}
        {...props}
      />
      {maxLength && (
        <div className="text-muted-foreground absolute right-2 bottom-1.5 text-xs">
          {charCount}/{maxLength}
        </div>
      )}
    </div>
  );
}

export { Textarea };

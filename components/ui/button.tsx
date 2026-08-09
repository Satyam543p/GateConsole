import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[16px] font-heading font-bold whitespace-nowrap outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground neo-btn',
        outline:
          'bg-white text-primary neo-btn',
        secondary:
          'bg-secondary text-secondary-foreground neo-btn',
        ghost:
          'hover:bg-muted hover:text-primary rounded-xl',
        destructive:
          'bg-destructive text-white neo-btn',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-[20px] py-[10px] text-[15px]',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-11 px-8 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

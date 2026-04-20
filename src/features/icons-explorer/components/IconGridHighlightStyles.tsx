"use client"

interface IconGridHighlightStylesProps {
    activeIconId: string
}

export const IconGridHighlightStyles = ({ activeIconId }: IconGridHighlightStylesProps) => {
    if (!activeIconId) {
        return null
    }

    return (
        <style
            dangerouslySetInnerHTML={{
                __html: `
          [data-icon-id="${activeIconId}"] {
            background-color: color-mix(in oklab, var(--primary) 12%, var(--surface));
            border-color: color-mix(in oklab, var(--primary) 40%, var(--surface-border));
            box-shadow: var(--shadow-soft);
          }
        `,
            }}
        />
    )
}

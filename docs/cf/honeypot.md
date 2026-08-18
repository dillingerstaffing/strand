# The honeypot is positioned off screen, not `display: none`

`.strand-honeypot` hides the bot-trap field by positioning it off screen with `aria-hidden` and `tabindex="-1"`, never with `display: none`, because some bots skip fields that are not displayed and the trap only works if it looks like a field.

Where: `packages/strand-ui/src/components/FormLayout/FormLayout.css`

// Mock for next/image
const Image = ({ src, alt, priority, ...props }) => {
  // Remove priority prop as it's not a valid HTML attribute
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img src={src} alt={alt} {...props} />
}

module.exports = Image

import { useState } from "react";
import Image from "next/image";

export default function RecipeImage({ src, alt, ...props }) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const imageSrc = hasError
    ? "/pic_kappa.webp"
    : `/api/proxy?url=${encodeURIComponent(src)}`;//`/api/proxy?url=${encodeURIComponent(src)}`;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      onError={handleError}
      fill
      unoptimized 
      className="object-cover"
      {...props}
    />
  );
}

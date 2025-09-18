import Image from "next/image";

export default function Logo() {
  return (
    <a href="https://macstudionexus.com">
      <Image src="/temp-logo.svg" height={100} width={100} alt="Logo" className=""/>
    </a>
  );
}

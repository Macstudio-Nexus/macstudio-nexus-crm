import Image from "next/image";

export default function () {
  return (
    <div className="font-plex text-sm md:text-lg ">
      &copy; {new Date().getFullYear()} Macstudio nexus. All rights reserved.
    </div>
  );
}

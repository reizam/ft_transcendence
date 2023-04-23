import React from "react";
import { FiSettings } from "react-icons/fi";
import Link from "next/link";

function Settings() {
  return (
    <div className="settings">
      <Link href={`/`}>
        <div className="ctn-set">
          <p>
            <FiSettings size={25} />
          </p>
        </div>
      </Link>
    </div>
  );
}

export default Settings;

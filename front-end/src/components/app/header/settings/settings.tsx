import React from "react";
import { FiSettings } from "react-icons/fi";
import Link from "next/link";
import settingsStyles from "./settings.module.css"

function Settings() {
  return (
    <div className={settingsStyles.settings}>
      <Link href={`/`}>
        <div className={settingsStyles.ctn__set}>
          <p className={settingsStyles.ctn__set__p}>
            <FiSettings className={settingsStyles.fi__settings}/>
          </p>
        </div>
      </Link>
    </div>
  );
}

export default Settings;

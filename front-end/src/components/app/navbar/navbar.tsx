import React from 'react';
import navbarStyles from "./navbar.module.css";
import { useAuth } from "@/providers/auth/auth.context";
import { AiOutlinePoweroff } from 'react-icons/ai';
import { FaGamepad, FaUserFriends } from 'react-icons/fa';
import { BsChatTextFill } from 'react-icons/bs';
import Game from "@/pages/game";
import Index from "@/pages/index"
import Link from 'next/link';


interface Props {}

function Navbar(props: Props) {
    const { logout } = useAuth();

    return (
        <nav className={navbarStyles.navbar}>
            <div className={navbarStyles.ctn__navbar}>
                <Link href="/game" className={navbarStyles.button__navbar}>
                    <button
                        className={navbarStyles.button__navbar}
                        onClick={Game}
                    >
                        <p className={navbarStyles.button__icon__navbar}>
                            <FaGamepad size={30}  />
                        </p>
                    </button>
                </Link>
                <Link href="/" className={navbarStyles.button__navbar}>
                    <button 
                        className={navbarStyles.button__navbar}
                        onClick={Index}
                    >
                        <p className={navbarStyles.button__icon__navbar}>
                            <BsChatTextFill size={30} />
                        </p>
                    </button>
                </Link>
                <Link href="/dashboard" className={navbarStyles.button__navbar}>
                    <button className={navbarStyles.button__navbar}>
                        <p className={navbarStyles.button__icon__navbar}>
                            <FaUserFriends size={30} />
                        </p>
                    </button>
                </Link>
            </div>
            <button
                onClick={logout} 
                className={navbarStyles.ctn__off}>
                <p className={navbarStyles.ctn__off__p}>
                    <AiOutlinePoweroff size={30}/>
                </p>
            </button>
        </nav>
    )
}

export default Navbar

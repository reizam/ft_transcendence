import React from 'react';
import styleButton from './Button.module.css';

interface Props {}

function Button(props: Props) {
    const {} = props

    return (
		<>
			<button className={styleButton.style__button}>
				Button
			</button>
		</>
    )
}

export default Button

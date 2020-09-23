import React from 'react';
import * as styles from '../styles/ButtonStyles.scss';
import { mergeClasses } from '../utils/utils';
import { Spinner } from '@chakra-ui/core';

type Props = {
    onClick?: (event: any) => any;
    className?: any;
    disabled?: boolean;
    loading?: boolean;
    style?: any;
    children?: string;
}

const Button = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const { children, onClick, className, disabled, loading, style } = props;

    const _className = mergeClasses(styles.button, className);
    const _innerClassName = loading ? styles.loading : null;

    return (
        <button
            disabled={disabled || loading}
            className={_className}
            ref={ref}
            onClick={onClick}
            style={style}
        >
            <span className={_innerClassName}>{children}</span>
            {loading && <Spinner position='absolute'/>}
        </button>
    )
});

export default Button;
import React, { FC } from 'react';

type Props = {
    when: boolean;
};

export const Hidden: FC<Props> = (props) => {
    const { when, children } = props;

    if (when !== undefined && when) return null;
    return <React.Fragment>{children}</React.Fragment>;
}

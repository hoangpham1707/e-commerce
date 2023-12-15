import React from 'react';

const FormatDes = ({ description }) => {
    return <div dangerouslySetInnerHTML={{ __html: description }} />;
};

export default FormatDes;
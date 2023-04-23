import React from "react";

interface titleProps {
  title?: string;
}

function Title({ title }: titleProps) {
  return (
    <div className="title">
        <h1>{title}</h1>
    </div>
  );
}

export default Title;
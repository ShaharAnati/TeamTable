import { Card, CardContent, CardHeader, Divider } from "@mui/material";
import React from "react";

type Props = {
  title: string;
  children: any;
};

function FormSection({ title, children }: Props) {
  return (
    <Card variant="outlined" sx={{ borderRadius: "12px" }}>
      <CardHeader title={title} />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default FormSection;

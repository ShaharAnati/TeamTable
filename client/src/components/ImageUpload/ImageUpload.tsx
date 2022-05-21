import React from "react";
import { Card } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import "./ImageUpload.css";

export const ImageUpload = () => {
    return (
        <Card className="ImageUpload">
            <UploadIcon />
            Upload
        </Card>
    );
};

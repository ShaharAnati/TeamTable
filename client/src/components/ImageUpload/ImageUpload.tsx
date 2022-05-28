import React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import UploadIcon from "@mui/icons-material/Upload";
import { v4 as uuidv4 } from "uuid";

import "./ImageUpload.css";

import { storage } from "../../firebase/firebase";

const STORAGE_DIR = "images";

export const deleteUnusedImages = (imagesNames: string[]) => {
  // Create a reference to the file to delete

  for (const imageName in imagesNames) {
    const desertRef = storage.ref(STORAGE_DIR).child(imageName);

    // Delete the file
    desertRef
      .delete()
      .then(function () {
        // File deleted successfully
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
      });
  }
};

const Input = styled("input")({
  display: "none",
});

export const ImageUpload = (props: { setImageAsUrl; imageAsUrl }) => {
  const { setImageAsUrl, imageAsUrl } = props;
  const [previousUrls, setPreviousUrls] = React.useState([]);

  const handleFireBaseUpload = (e) => {
    const imageFile = e.target.files[0];
    const imageName = uuidv4();

    e.preventDefault();
    console.log("start of upload");
    // async magic goes here...
    const uploadTask = storage
      .ref(`/${STORAGE_DIR}/${imageName}`)
      .put(imageFile);

    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref(STORAGE_DIR)
          .child(imageName)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            //    if(imageAsUrl) {
            //     previousUrls.push(imageName);
            //    }

            setImageAsUrl((prevObject) => ({
              ...prevObject,
              imgUrl: fireBaseUrl,
            }));
          });
      }
    );
  };

  return (
    <>
      <label htmlFor="contained-button-file">
        <Input
          id="contained-button-file"
          type="file"
          onChange={handleFireBaseUpload}
        />
        <Button variant="contained" component="span" endIcon={<UploadIcon />}>
          Upload
        </Button>
      </label>

      <div>
        {imageAsUrl.imgUrl && <img src={imageAsUrl.imgUrl} alt="image tag" />}
      </div>
    </>
  );
};

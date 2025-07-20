import { useState, useRef } from "react";
import ButtonWrapper from "./Buttons";
import Label from "./Label";
import { X } from "lucide-react";
import { IKUpload } from "imagekitio-react";
import { alertInfo } from "../utility/Alert";

export default function ImageInput({
  setImagePreviews,
  imagePreviews,
  UserData,
}) {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  //   const handleImageChange = (e) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       if (file.type.startsWith("image/")) {
  //         const reader = new FileReader();
  //         reader.onload = (e) => {
  //           setImage(e.target?.result);
  //         };
  //         reader.readAsDataURL(file);
  //         setError(null);
  //       } else {
  //         setError("Please select a valid image file.");
  //         setImage(null);
  //       }
  //     }
  //     };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    console.log(file);
    
    if (file) {
      setImagePreviews((prevState) => ({
        ...prevState,
        [name]: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveImage = (name) => {
    setImagePreviews((prevState) => ({
      ...prevState,
      [name]: null,
    }));
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ImageKit handlers
  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);

    setImagePreviews((prevState) => ({
      ...prevState,
      [res?.name]: res?.url,
    }));
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt) => {
    console.log("Start", evt);
  };

  return (
    <div className="w-1/2  max-w-md mx-5 space-y-4">
      <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <Label htmlFor={UserData?.inputName} className="cursor-pointer">
          <div className="flex flex-col items-center space-y-2">
            {imagePreviews ? (
              <div className="relative">
                <img
                  src={imagePreviews}
                  alt="Preview"
                  className="w-64 h-64 object-cover rounded-lg"
                />
                <div className="flex gap-5">
                  <span>{UserData?.inputName}</span>
                  <ButtonWrapper
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 -mt-2 -mr-2"
                    onClick={() => handleRemoveImage(UserData?.inputName)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </ButtonWrapper>
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  if (UserData?.userName === "") {
                    alertInfo("Please enter your name first");
                    return;
                  }
                }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="p-4 bg-gray-100 rounded-full">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-500">
                  Click to upload an image
                </span>
              </div>
            )}
          </div>

          {UserData?.userName === "" ? null : (
            <IKUpload
              fileName={`${UserData?.inputName}`}
              tags={[`${UserData?.tags[0]}`, `${UserData?.tags[1]}`]}
              isPrivateFile={false}
              useUniqueFileName={false}
              responseFields={["tags"]}
              validateFile={(file) => file.size < 2000000}
              folder={`all-Drivers/${UserData?.userName?.split(" ").join("-")}`}
              overwriteFile={true}
              overwriteAITags={true}
              overwriteTags={true}
              overwriteCustomMetadata={true}
              onError={onError}
              onSuccess={onSuccess}
              onUploadProgress={onUploadProgress}
              onUploadStart={onUploadStart}
              id={UserData?.inputName}
              name={UserData?.inputName}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              required
            />
          )}
        </Label>
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
}

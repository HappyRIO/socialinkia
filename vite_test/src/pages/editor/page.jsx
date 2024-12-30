import { useRef, useEffect, useState } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";

const Editor = () => {
  const editorRef = useRef(null);

  const [editorSize, setEditorSize] = useState({
    width: "1000px",
    height: "700px"
  });

 useEffect(() => {
   // Update size dynamically when window resizes
   const handleResize = () => {
     const width = window.innerWidth * 0.9; // 90% of the viewport width
     const height = window.innerHeight * 0.7; // 70% of the viewport height
     setEditorSize({ width: `${width}px`, height: `${height}px` });
   };

   window.addEventListener("resize", handleResize);
   handleResize(); // Set initial size

   // Change the logo image source
   const editorLogo = document.getElementsByClassName(
     "tui-image-editor-header-logo"
   )[0];
   if (editorLogo) {
     const img = editorLogo.querySelector("img");
     if (img) {
       img.src = "/nav.png"; // Change the image source to /nav.png
     }
   }

   return () => window.removeEventListener("resize", handleResize);
 }, []);


  return (
    <div>
      <ImageEditor
        ref={editorRef}
        includeUI={{
          loadImage: {
            path: "/image.jpg",
            name: "SampleImage"
          },
          menu: ["shape", "text", "crop", "resize", "draw"],
          initMenu: "",
          uiSize: {
            width: `${editorSize.width}`,
            height: `${editorSize.height}`
            // width: "1000px",
            // height: "700px"
          },
          menuBarPosition: "bottom"
        }}
        cssMaxHeight={500}
        cssMaxWidth={700}
        selectionStyle={{
          cornerSize: 20,
          rotatingPointOffset: 70
        }}
        usageStatistics={true}
      />
    </div>
  );
};

export default Editor;

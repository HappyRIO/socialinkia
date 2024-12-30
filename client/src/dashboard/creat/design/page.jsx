import { useRef, useEffect, useState } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";

const Editor = () => {
  const queryParams = new URLSearchParams(location.search);
  const qpheight = queryParams.get("height") * 0.8;
  const qpwidth = queryParams.get("width") * 0.8;
  const editorRef = useRef(null);

  const [editorSize, setEditorSize] = useState({
    width: "100vw", // 100% of the viewport width
    height: "100vh" // 100% of the viewport height
  });

  useEffect(() => {
    // Update size dynamically when window resizes
    const handleResize = () => {
      const width = window.innerWidth; // 100% of the viewport width
      const height = window.innerHeight; // 100% of the viewport height
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
        img.src = "/images/nav.png"; // Change the image source to /nav.png
      }
    }
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full overflow-hidden h-full min-h-screen items-center justify-center">
      <ImageEditor
        ref={editorRef}
        includeUI={{
          loadImage: {
            path: `https://placehold.co/${qpwidth}x${qpheight}/e7e2e1/e96311?font=roboto&text=socialLinkia`,
            name: "SampleImage"
          },
          menu: ["shape", "text", "crop", "resize", "draw"],
          initMenu: "",
          uiSize: {
            width: editorSize.width, // Dynamically set width
            height: editorSize.height // Dynamically set height
          },
          menuBarPosition: "bottom"
        }}
        cssMaxHeight={qpheight}
        cssMaxWidth={qpwidth}
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

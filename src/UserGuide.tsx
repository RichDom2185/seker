import React, { useCallback, useState } from "react";
import { Languages } from "./utils/constants";

const clickableTextStyle: React.CSSProperties = {
  cursor: "pointer",
  textDecoration: "underline",
};

const UserGuide: React.FC = () => {
  const [isShown, setIsShown] = useState(false);

  const toggleIsShown = useCallback<React.MouseEventHandler>(
    (_) => setIsShown((oldValue) => !oldValue),
    [setIsShown]
  );

  if (!isShown) {
    return (
      <p
        onClick={toggleIsShown}
        style={{
          ...clickableTextStyle,
          width: "max-content",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        View User Guide
      </p>
    );
  }
  return (
    <div className="modal" style={{ maxWidth: 640, margin: "0.83em auto" }}>
      <p
        onClick={toggleIsShown}
        style={{ ...clickableTextStyle, textAlign: "right", marginTop: 0 }}
      >
        Close <i>×</i>
      </p>
      <ol
        style={{
          columnCount: 2,
          columnGap: "3.6em",
          textAlign: "left",
        }}
      >
        <li>
          Connect your SPIKE Prime to your computer via USB.
          <br />
          <em>
            <strong>Note:</strong> You can also connect via Bluetooth but
            reliability will not be guaranteed.
          </em>
        </li>
        <li>
          Select the appropriate language mode: {Languages.SOURCE_THREE} or{" "}
          {Languages.PYTHON}
        </li>
        <li>After finishing your code, click the "Run on Device" button.</li>
        <li>
          Select the correct port from the pop-up that is shown.
          <br />
          <em>
            <strong>Note:</strong> SEKER only supports Chromium-based browsers
            version 89 and onwards. If you do not see a pop-up, this means your
            browser is not supported.
          </em>
        </li>
        <li>The SPIKE Prime should start running your code.</li>
      </ol>
    </div>
  );
};

export default UserGuide;
